// ==UserScript==
// @name          3327-luogu | 洛谷颜色自定义
// @namespace     https://www.luogu.com.cn/user/542457
// @description   可以根据个人喜好，自定义洛谷各个地方的颜色。
// @author        cff_0102
// @run-at        document_start
// @version       4.1.3.1
// @license       MIT
// @match         https://www.luogu.com.cn/*
// @match         https://www.luogu.com/*
// @match         https://www.luogu.org/
// @exclude       *admin*
// @icon          https://www.luogu.com.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/474873/3327-luogu%20%7C%20%E6%B4%9B%E8%B0%B7%E9%A2%9C%E8%89%B2%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/474873/3327-luogu%20%7C%20%E6%B4%9B%E8%B0%B7%E9%A2%9C%E8%89%B2%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==
(function(){'use strict';var BGI = '',BGC = '',FIL = '';// 修改下面的代码可实现自定义
    function changeColors(){//↓ 更改这里的八个十六进制颜色即可更改洛谷相应版块的颜色
        const newcolor1 = '#34495e'; // “全部板块”的颜色
        const newcolor2 = '#8e44ad'; // “站务版”的颜色
        const newcolor3 = '#52c41a'; // “题目总版”的颜色
        const newcolor4 = '#e74c3c'; // “学术版”的颜色
        const newcolor5 = '#3ba4a4'; // “灌水区”的颜色
        const newcolor6 = '#f39c11'; // “工单反馈版”的颜色
        const newcolor7 = '#996600'; // “小黑屋”的颜色
        const newcolor8 = '#3498db'; // 团队内帖子的颜色
        const ch1 = 1;// 是否更改帖子的背景色（0 或 1）（见 1.0.2 版本发布内容）
        // 更改上面的颜色（并保存更改后的脚本）即可实现更改洛谷对应讨论区的颜色
        const articol1='#272727';
        const articol2='#3498db';
        const articol3='#f39c11';
        const articol4='#9d3dcf';
        const articol5='#70ad47';
        const articol6='#2949b4';
        const articol7='#fe4c61';
        const articol8='#3ba4a4';
        const articol9='#3ba4a4';
        const articol0='#13c2c2';
        // 上面是专栏颜色设置，分别是文章区左侧上方从上到下七个的颜色，个人记录、闲话的颜色，以及左侧下方精选合集的颜色。
        const cht = 1;// 是否更改题目 tag 颜色
        const newzw = '#bfbfbf';// 如果更改题目 tag 颜色，暂无评定 tag 的颜色
        const newrm = '#fe4c61';// 如果更改题目 tag 颜色，入门 tag 的颜色
        const newpj = '#f39c11';// 如果更改题目 tag 颜色，普及- tag 的颜色
        const newpt = '#ffc116';// 如果更改题目 tag 颜色，普及/提高− tag 的颜色
        const newtp = '#52c41a';// 如果更改题目 tag 颜色，普及+/提高 tag 的颜色
        const newtg = '#3498db';// 如果更改题目 tag 颜色，提高+/省选− tag 的颜色
        const newsx = '#9d3dcf';// 如果更改题目 tag 颜色，省选/NOI− tag 的颜色
        const newht = '#0e1d69';// 如果更改题目 tag 颜色，NOI/NOI+/CTSC tag 的颜色
        const newsf = '#2949b4';// 如果更改题目 tag 颜色，算法 tag 的颜色
        const newly = '#13c2c2';// 如果更改题目 tag 颜色，来源 tag 的颜色
        const newsj = '#3498db';// 如果更改题目 tag 颜色，时间 tag 的颜色
        const newqy = '#52c41a';// 如果更改题目 tag 颜色，区域 tag 的颜色
        const newts = '#f39c11';// 如果更改题目 tag 颜色，特殊题目 tag 的颜色
        // 上面是关于题目 tag 颜色的设置
        const txtc = '#236464';// 洛谷所有字体和图标颜色（如讨论列表左侧栏未被选中的字的颜色等）（#000000 就是洛谷默认的黑色，不想更改就填 #000000）
        const bgc = '#ffffffc0';// 洛谷各个页面卡片颜色（后两位是不透明度）（洛谷原版是 #ffffffff，不想更改就填 #ffffffff）
        const chm = 0;// 是否更改私信中消息的背景（为 1 的话就将背景设成卡片颜色）
        const opt = 1;// 是否更改页面的背景（0 或 1 或 2，0 表示不更改，仍保持原来的灰色；1 表示更改为纯色；2 表示更改为图片）
        const bgc1 = '#e8f9f8';// 如果 opt 为 1，要更改的背景颜色（#efefef 是洛谷默认背景色）（顺带一提，这个背景色其实是和 https://www.luogu.com.cn/theme/design/98289 相匹配的）
        const bgi2 = 'url("https://cdn.luogu.com.cn/upload/image_hosting/4o69jrj4.png")';// 如果 opt 为 2，要更改的背景图片链接（更改双引号中间的内容即可）
        const delzt = 0;// 是否隐藏主题（即顶栏和底栏）（此时建议同时更改页面背景）
        const chd = 1;// 是否更改顶栏的背景和字体颜色（字体颜色就是上面的 txtc）
        const hdbgc = '#ffffffc0';// 如果更改，顶栏的背景色
        // 上面是关于全洛谷页面显示的设置
        // 更改上面的设置即可更改显示效果
        // 建议在某个地方保存自己的设置，以免更新时回到原来的设置！更新前先复制以上部分的设置，再进行更新，更新结束后再将上面的设置改回来。
        /*
        附：
        1. 类似“深色模式”：
        const newcolor1 = '#3498db'; // “全部板块”的颜色
        const newcolor2 = '#8e44ad'; // “站务版”的颜色
        const newcolor3 = '#52c41a'; // “题目总版”的颜色
        const newcolor4 = '#e74c3c'; // “学术版”的颜色
        const newcolor5 = '#3ba4a4'; // “灌水区”的颜色
        const newcolor6 = '#f39c11'; // “工单反馈版”的颜色
        const newcolor7 = '#996600'; // “小黑屋”的颜色
        const newcolor8 = '#3498db'; // 团队内帖子的颜色
        const ch1 = 1;// 是否更改帖子的背景色（0 或 1）（见 1.0.2 版本发布内容）
        // 更改上面的颜色（并保存更改后的脚本）即可实现更改洛谷对应讨论区的颜色
        const articol1='#30d5c8';
        const articol2='#3498db';
        const articol3='#f39c11';
        const articol4='#9d3dcf';
        const articol5='#70ad47';
        const articol6='#2949b4';
        const articol7='#fe4c61';
        const articol8='#3ba4a4';
        const articol9='#3ba4a4';
        const articol0='#13c2c2';
        // 上面是专栏颜色设置，分别是文章区左侧上方从上到下七个的颜色，个人记录、闲话的颜色，以及左侧下方精选合集的颜色。
        const cht = 1;// 是否更改题目 tag 颜色
        const newzw = '#bfbfbf';// 如果更改题目 tag 颜色，暂无评定 tag 的颜色
        const newrm = '#fe4c61';// 如果更改题目 tag 颜色，入门 tag 的颜色
        const newpj = '#f39c11';// 如果更改题目 tag 颜色，普及- tag 的颜色
        const newpt = '#ffc116';// 如果更改题目 tag 颜色，普及/提高− tag 的颜色
        const newtp = '#52c41a';// 如果更改题目 tag 颜色，普及+/提高 tag 的颜色
        const newtg = '#3498db';// 如果更改题目 tag 颜色，提高+/省选− tag 的颜色
        const newsx = '#9d3dcf';// 如果更改题目 tag 颜色，省选/NOI− tag 的颜色
        const newht = '#0e1d69';// 如果更改题目 tag 颜色，NOI/NOI+/CTSC tag 的颜色
        const newsf = '#2949b4';// 如果更改题目 tag 颜色，算法 tag 的颜色
        const newly = '#13c2c2';// 如果更改题目 tag 颜色，来源 tag 的颜色
        const newsj = '#3498db';// 如果更改题目 tag 颜色，时间 tag 的颜色
        const newqy = '#52c41a';// 如果更改题目 tag 颜色，区域 tag 的颜色
        const newts = '#f39c11';// 如果更改题目 tag 颜色，特殊题目 tag 的颜色
        // 上面是关于题目 tag 颜色的设置
        const txtc = '#e5e5e5';// 洛谷所有字体和图标颜色（如讨论列表左侧栏未被选中的字的颜色等）（#000000 就是洛谷默认的黑色，不想更改就填 #000000）
        const bgc = '#5e5e5ec0';// 洛谷各个页面卡片颜色（后两位是不透明度）（洛谷原版是 #ffffffff，不想更改就填 #ffffffff）
        const chm = 1;// 是否更改私信中消息的背景（为 1 的话就将背景设成卡片颜色）
        const opt = 1;// 是否更改页面的背景（0 或 1 或 2，0 表示不更改，仍保持原来的灰色；1 表示更改为纯色；2 表示更改为图片）
        const bgc1 = '#2b2b2b';// 如果 opt 为 1，要更改的背景颜色（#efefef 是洛谷默认背景色）（顺带一提，这个背景色其实是和 https://www.luogu.com.cn/theme/design/210036 相匹配的）
        const bgi2 = 'url("https://cdn.luogu.com.cn/upload/image_hosting/4o69jrj4.png")';// 如果 opt 为 2，要更改的背景图片链接（更改双引号中间的内容即可）
        const delzt = 1;// 是否隐藏主题（即顶栏和底栏）（此时建议同时更改页面背景）
        const chd = 1;// 是否更改顶栏的背景和字体颜色（字体颜色就是上面的 txtc）
        const hdbgc = '#5e5e5ec0';// 如果更改，顶栏的背景色
        // 上面是关于全洛谷页面显示的设置
        2. 洛谷原版：
        const newcolor1 = '#272727'; // “全部板块”的颜色
        const newcolor2 = '#14558f'; // “站务版”的颜色
        const newcolor3 = '#f39c11'; // “题目总版”的颜色
        const newcolor4 = '#9d3dcf'; // “学术版”的颜色
        const newcolor5 = '#52c41a'; // “灌水区”的颜色
        const newcolor6 = '#2949b4'; // “工单反馈版”的颜色
        const newcolor7 = '#272727'; // “小黑屋”的颜色
        const newcolor8 = '#272727'; // 团队内帖子的颜色
        const ch1 = 0;// 是否更改帖子的背景色（0 或 1）（见 1.0.2 版本发布内容）
        // 更改上面的颜色（并保存更改后的脚本）即可实现更改洛谷对应讨论区的颜色
        const articol1='#272727';
        const articol2='#3498db';
        const articol3='#f39c11';
        const articol4='#9d3dcf';
        const articol5='#70ad47';
        const articol6='#2949b4';
        const articol7='#fe4c61';
        const articol8='#3ba4a4';
        const articol9='#3ba4a4';
        const articol0='#13c2c2';
        // 上面是专栏颜色设置，分别是文章区左侧上方从上到下七个的颜色，个人记录、闲话的颜色，以及左侧下方精选合集的颜色。
        const cht = 0;// 是否更改题目 tag 颜色
        const newzw = '#bfbfbf';// 如果更改题目 tag 颜色，暂无评定 tag 的颜色
        const newrm = '#fe4c61';// 如果更改题目 tag 颜色，入门 tag 的颜色
        const newpj = '#f39c11';// 如果更改题目 tag 颜色，普及- tag 的颜色
        const newpt = '#ffc116';// 如果更改题目 tag 颜色，普及/提高− tag 的颜色
        const newtp = '#52c41a';// 如果更改题目 tag 颜色，普及+/提高 tag 的颜色
        const newtg = '#3498db';// 如果更改题目 tag 颜色，提高+/省选− tag 的颜色
        const newsx = '#9d3dcf';// 如果更改题目 tag 颜色，省选/NOI− tag 的颜色
        const newht = '#0e1d69';// 如果更改题目 tag 颜色，NOI/NOI+/CTSC tag 的颜色
        const newsf = '#2949b4';// 如果更改题目 tag 颜色，算法 tag 的颜色
        const newly = '#13c2c2';// 如果更改题目 tag 颜色，来源 tag 的颜色
        const newsj = '#3498db';// 如果更改题目 tag 颜色，时间 tag 的颜色
        const newqy = '#52c41a';// 如果更改题目 tag 颜色，区域 tag 的颜色
        const newts = '#f39c11';// 如果更改题目 tag 颜色，特殊题目 tag 的颜色
        // 上面是关于题目 tag 颜色的设置
        const txtc = '#000000';// 洛谷所有字体和图标颜色（如讨论列表左侧栏未被选中的字的颜色等）（#000000 就是洛谷默认的黑色，不想更改就填 #000000）
        const bgc = '#ffffffff';// 洛谷各个页面卡片颜色（后两位是不透明度）（洛谷原版是 #ffffffff，不想更改就填 #ffffffff）
        const chm = 0;// 是否更改私信中消息的背景（为 1 的话就将背景设成卡片颜色）
        const opt = 0;// 是否更改页面的背景（0 或 1 或 2，0 表示不更改，仍保持原来的灰色；1 表示更改为纯色；2 表示更改为图片）
        const bgc1 = '#e8f9f8';// 如果 opt 为 1，要更改的背景颜色（#efefef 是洛谷默认背景色）（顺带一提，这个背景色其实是和 https://www.luogu.com.cn/theme/design/98289 相匹配的）
        const bgi2 = 'url("https://cdn.luogu.com.cn/upload/image_hosting/4o69jrj4.png")';// 如果 opt 为 2，要更改的背景图片链接（更改双引号中间的内容即可）
        const delzt = 0;// 是否隐藏主题（即顶栏和底栏）（此时建议同时更改页面背景）
        const chd = 0;// 是否更改顶栏的背景和字体颜色（字体颜色就是上面的 txtc）
        const hdbgc = '#ffffffc0';// 如果更改，顶栏的背景色
        // 上面是关于全洛谷页面显示的设置
        */

        function hexToRgb(hex) {hex = hex.replace(/^#/, '');const bigint = parseInt(hex, 16);const r = (bigint >> 16) & 255;const g = (bigint >> 8) & 255;const b = bigint & 255;return { r, g, b };}
        function lighterColor(hex) {hex = hex.replace(/^#/, '');const bigint = parseInt(hex, 16);let r = (bigint >> 16) & 255;let g = (bigint >> 8) & 255;let b = bigint & 255;r = Math.floor(255 - (255 - r) / 2);g = Math.floor(255 - (255 - g) / 2);b = Math.floor(255 - (255 - b) / 2);const newHex = ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);return `#${newHex}`;}

        // 下面这个函数可以关闭广告。不想关的话注释掉就行了。
        function closeDivsWithAttributes(attributeValue) {
            var divElements = document.getElementsByTagName('div');
            for (var i = 0; i < divElements.length; i++) {
                var div = divElements[i];
                if (div.getAttribute('data-v-fdcd5a58') === attributeValue) {
                    div.remove();
                }
                if (div.getAttribute('data-v-0a593618') === attributeValue) {
                    div.remove();
                }
            }
        }
        closeDivsWithAttributes("");

        if(window.location.href.startsWith('https://www.luogu.com.cn/theme/list')||window.location.href.startsWith('https://www.luogu.com/theme/list')){
            elements = document.querySelector('h1.lfe-h1');
            elements.textContent="主题商店（温馨提醒：更换主题后要刷新，防止插件出现不可避免的 bug）"
        }
        var indicators = document.querySelectorAll('.wrap>.indicator[data-v-88d5ecf4]');
        indicators.forEach(indicator => {
            indicator.style.color = 'unset';
        });
        indicators = document.querySelectorAll('.wrap>.name[data-v-88d5ecf4]');
        indicators.forEach(indicator => {
            indicator.style.color = 'unset';
        });
        if (chd) {
            // 更改顶栏背景颜色
            var targetCSS = [
                "#app > .main-container > .header-layout.tiny{",
                "    height: 4em !important;",
                `    background: ${hdbgc} !important;`,
                "}",
            ].join('\n');
            var existingStyles = document.querySelectorAll("style");
            var lastLines = "";
            let f = 0;
            for (let i = 0; i < existingStyles.length; i++) {
                var style = existingStyles[i];
                var styleText = style.textContent || style.innerText;
                var lines = styleText.split('\n');
                var numLinesToCheck = 4;
                if (lines.length >= numLinesToCheck) {
                    lastLines = lines.slice(-numLinesToCheck).join('\n');
                    if (lastLines === targetCSS) {
                        f = 1;
                        break;
                    }
                }
            }
            if(f){}
            else if (typeof GM_addStyle != "undefined") {
                GM_addStyle(targetCSS);
            } else if (typeof PRO_addStyle != "undefined") {
                PRO_addStyle(targetCSS);
            } else if (typeof addStyle != "undefined") {
                addStyle(targetCSS);
            } else {
                var node = document.createElement("style");
                node.type = "text/css";
                node.appendChild(document.createTextNode(targetCSS));
                var heads = document.getElementsByTagName("head");
                if (heads.length > 0) {
                    heads[0].appendChild(node);
                } else {
                    document.documentElement.appendChild(node);
                }
            }
            // 更改字体颜色
            var tmp = document.querySelector('div.wrapper.wrapped.lfe-body.header-layout.tiny');
            if(tmp){
                var pmet = tmp.querySelector('div.link-container');
                if(pmet){
                    var backgroundDivs = pmet.querySelectorAll('a.header-link.color-none');
                    backgroundDivs.forEach(function(div) {
                        div.style.color = txtc;
                    });
                }
                backgroundDivs = tmp.querySelectorAll('svg[data-v-0640126c]:not(div.center svg[data-v-0640126c])');
                backgroundDivs.forEach(function(div) {
                    div.style.color = txtc;
                });
                backgroundDivs = tmp.querySelectorAll('svg[data-v-258e49ac]:not(div.dropdown svg[data-v-258e49ac])');
                backgroundDivs.forEach(function(div) {
                    div.style.color = txtc;
                });
            }
            tmp = document.querySelector('div.user-nav');
            if(tmp){
                backgroundDivs = tmp.querySelectorAll('svg[data-v-0640126c]:not(div.dropdown svg[data-v-0640126c])');
                backgroundDivs.forEach(function(div) {
                    div.style.color = txtc;
                });
                backgroundDivs = tmp.querySelectorAll('svg[data-v-258e49ac]:not(div.dropdown svg[data-v-258e49ac])');
                backgroundDivs.forEach(function(div) {
                    div.style.color = txtc;
                });
            }
        }

        const elementsWithCustomStyle = document.querySelectorAll('[style*="--link-indicator-color: #f39c11; color: var(--link-indicator-color);"]');// 题目讨论版
        elementsWithCustomStyle.forEach(function (element) {
            element.style.cssText = `--link-indicator-color: ${newcolor3}; color: var(--link-indicator-color);`;
        });
        var currentURL = window.location.href;

        /*
        // 检查链接是否以特定URL开头
        if (currentURL.startsWith("https://www.luogu.com.cn/discuss/new")) {
            // 获取所有class为card padding-default的元素
            elements = document.querySelectorAll(".card.padding-default");

            // 遍历元素并修改背景颜色
            elements.forEach(function(element) {
                element.style.backgroundColor = bgc;
            });
        }
        */
        //这一段是在判断帖子具体页面（如 discuss/61884）的最上面那个卡片底端颜色的问题
        const forumElement = document.querySelector("div[data-v-0fca37c7].side div[data-v-e01570a1][data-v-0fca37c7].l-card:not(.comment)");
        if(forumElement){
            // 获取所属板块的文本内容
            const forumTextElement = forumElement.querySelector("a[data-v-12b24cc3][data-v-0fca37c7]");//console.log(1);
            if(forumTextElement){
                const forumText = forumTextElement.textContent.trim();
                const temp = document.querySelector("div[data-v-0fca37c7].main");
                const temp1 = temp.querySelector("div[data-v-e01570a1][data-v-0fca37c7].l-card:not(.comment)");
                // 根据所属板块的文本内容判断是否需要修改颜色
                if (forumText === '站务版' && !(window.location.href.startsWith('https://www.luogu.com.cn/discuss/new')||window.location.href.startsWith('https://www.luogu.com/discuss/new'))/* 防止在帖子发布页（https://www.luogu.com.cn/discuss/new?forum=xxx）底下也出现站务版颜色边框 */) {
                    const newColor = newcolor2; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }else if (forumText === '题目总版') {
                    const newColor = newcolor3; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }else if (forumText === '学术版') {
                    const newColor = newcolor4; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }else if (forumText === '灌水区') {
                    const newColor = newcolor5; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }else if (forumText === '工单反馈版') {
                    const newColor = newcolor6; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }else if (forumText === '小黑屋') {
                    const newColor = newcolor7; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }else if (forumText.startsWith('团队')){// 团队帖子内
                    const newColor = newcolor8; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }else if ((window.location.href.startsWith('https://www.luogu.com.cn/discuss/')||window.location.href.startsWith('https://www.luogu.com/discuss/'))/* 确保在讨论区 */ && !(window.location.href.startsWith('https://www.luogu.com.cn/discuss/new')||window.location.href.startsWith('https://www.luogu.com/discuss/new'))/* 防止在帖子发布页（https://www.luogu.com.cn/discuss/new?forum=xxx）底下也出现题目版颜色边框 */){// 在题目详情页中
                    // console.log(forumText);
                    const newColor = newcolor3; // 设置新的颜色值
                    const rgbColor = hexToRgb(newColor); // 将十六进制颜色转换为 RGB 形式
                    // 修改元素的颜色属性
                    temp1.style.cssText = `border-bottom: 2px solid rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b});`;
                }
            }
        }
        if(window.location.href.includes("/discuss")){/*
            //这个目前只能修改左侧的
            const a=document.querySelectorAll("[title=全部板块]");
            for(let x of a) x.style.cssText = `--link-indicator-color: ${newcolor1}; color: var(--link-indicator-color);`; //洛谷蓝
            //const b=document.querySelectorAll("[title=站务版]");
            //for(let x of b) x.style.cssText = `--link-indicator-color: ${newcolor2}; color: var(--link-indicator-color);`; //紫名紫
            const c=document.querySelectorAll("[title=题目总版]");
            for(let x of c) x.style.cssText = `--link-indicator-color: ${newcolor3}; color: var(--link-indicator-color);`; // AC 绿
            const d=document.querySelectorAll("[title=学术版]");
            for(let x of d) x.style.cssText = `--link-indicator-color: ${newcolor4}; color: var(--link-indicator-color);`; //红名红
            const e=document.querySelectorAll("[title=灌水区]");
            for(let x of e) x.style.cssText = `--link-indicator-color: ${newcolor5}; color: var(--link-indicator-color);`;
            const f=document.querySelectorAll("[title=工单反馈版]");
            for(let x of f) x.style.cssText = `--link-indicator-color: ${newcolor6}; color: var(--link-indicator-color);`; //排行橙
            const g=document.querySelectorAll("[title=小黑屋]");
            for(let x of g){x.style.cssText = `--link-indicator-color: ${newcolor7}; color: var(--link-indicator-color);`; //棕名棕
                            const svgElement = x.querySelector("svg");
                            const pathElement = svgElement.querySelector("path");
                            pathElement.setAttribute("d", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48"); //更改小黑屋图标（从四个方块改成一个方块）
                           }
            const h=document.querySelectorAll("[title^=团队]");
            for(let x of h){x.style.cssText = `--link-indicator-color: ${newcolor8}; color: var(--link-indicator-color);`; //比赛蓝
                            const svgElement = x.querySelector("svg");
                            const pathElement = svgElement.querySelector("path");
                            pathElement.setAttribute("d", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48"); //更改小黑屋图标（从四个方块改成一个方块）
                           }*/
            //20241115 added 修改右侧代码
            var cff=document.querySelectorAll("a[data-v-12b24cc3][data-v-88d5ecf4].wrap");
            for(let x of cff){
                if(x.innerHTML.includes("全部板块"))x.style.cssText = `--link-indicator-color: ${newcolor1}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("站务版"))x.style.cssText = `--link-indicator-color: ${newcolor2}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("题目总版"))x.style.cssText = `--link-indicator-color: ${newcolor3}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("学术版"))x.style.cssText = `--link-indicator-color: ${newcolor4}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("灌水区"))x.style.cssText = `--link-indicator-color: ${newcolor5}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("工单反馈版"))x.style.cssText = `--link-indicator-color: ${newcolor6}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("小黑屋"))x.style.cssText = `--link-indicator-color: ${newcolor7}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("团队"))x.style.cssText = `--link-indicator-color: ${newcolor8}; color: var(--link-indicator-color);`;
                else x.style.cssText = `--link-indicator-color: ${newcolor3}; color: var(--link-indicator-color);`;
            }
            //20241116 竖屏时上方选择框
            cff=document.querySelectorAll("a[data-v-12b24cc3][data-v-88d5ecf4][data-v-a623cdfc][data-v-7daab60c-s].wrap");
            for(let x of cff){
                if(x.innerHTML.includes("全部板块"))x.style.cssText = `--link-indicator-color: ${newcolor1}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("站务版"))x.style.cssText = `--link-indicator-color: ${newcolor2}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("题目总版"))x.style.cssText = `--link-indicator-color: ${newcolor3}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("学术版"))x.style.cssText = `--link-indicator-color: ${newcolor4}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("灌水区"))x.style.cssText = `--link-indicator-color: ${newcolor5}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("工单反馈版"))x.style.cssText = `--link-indicator-color: ${newcolor6}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("小黑屋"))x.style.cssText = `--link-indicator-color: ${newcolor7}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("团队"))x.style.cssText = `--link-indicator-color: ${newcolor8}; color: var(--link-indicator-color);`;
                else x.style.cssText = `--link-indicator-color: ${newcolor3}; color: var(--link-indicator-color);`;
            }
        }else if(window.location.href.includes("article")){
            //20241115 专栏区
            //左侧的
            cff=document.querySelectorAll("a[data-v-12b24cc3][data-v-88d5ecf4][data-v-a623cdfc].wrap");
            for(let x of cff){
                if(x.innerHTML.includes("全部"))x.style.cssText = `--link-indicator-color: ${articol1}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("题解"))x.style.cssText = `--link-indicator-color: ${articol2}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("科技·工程"))x.style.cssText = `--link-indicator-color: ${articol3}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("算法·理论"))x.style.cssText = `--link-indicator-color: ${articol4}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("生活·游记"))x.style.cssText = `--link-indicator-color: ${articol5}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("学习·文化课"))x.style.cssText = `--link-indicator-color: ${articol6}; color: var(--link-indicator-color);`;
                else if(x.innerHTML.includes("休闲·娱乐"))x.style.cssText = `--link-indicator-color: ${articol7}; color: var(--link-indicator-color);`;
                else x.style.cssText = `--link-indicator-color: ${articol0}; color: var(--link-indicator-color);`;
            }
            //右侧的
            let cccc=document.querySelectorAll("div[data-v-5c428514].row-wrap div[data-v-e01570a1][data-v-291a2998][data-v-5c428514-s].l-card");
            for (let el of cccc) {let ee=el.querySelector("span[data-v-386007e1][data-v-291a2998]");//console.log(ee);
                if (ee&&ee.textContent.includes("全部")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol1))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("题解")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol2))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("科技·工程")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol3))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("算法·理论")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol4))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("生活·游记")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol5))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("学习·文化课")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol6))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("休闲·娱乐")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol7))}A0; color: var(--link-indicator-color);`;
                } else {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(articol0))}A0; color: var(--link-indicator-color);`;
                }
            }
        }
        function averageHexColor(hexColor, customColor) {
            // 提取原始颜色的R、G、B值和A值
            const originalR = parseInt(hexColor.slice(1, 3), 16);
            const originalG = parseInt(hexColor.slice(3, 5), 16);
            const originalB = parseInt(hexColor.slice(5, 7), 16);
            const originalA = parseInt(hexColor.slice(7, 9), 16);

            // 提取自定义颜色的R、G、B值
            const customR = parseInt(customColor.slice(1, 3), 16);
            const customG = parseInt(customColor.slice(3, 5), 16);
            const customB = parseInt(customColor.slice(5, 7), 16);

            // 创建新的颜色
            const averageR = Math.round((originalR + customR) / 2);
            const averageG = Math.round((originalG + customG) / 2);
            const averageB = Math.round((originalB + customB) / 2);

            // 将新的R、G、B值转换为16进制，并确保它们有两位
            const newR = ('0' + averageR.toString(16)).slice(-2);
            const newG = ('0' + averageG.toString(16)).slice(-2);
            const newB = ('0' + averageB.toString(16)).slice(-2);

            // 构建新的hex颜色字符串
            const newHexColor = `#${newR}${newG}${newB}${hexColor.slice(7, 9)}`;

            return newHexColor;
        }
        function combineColors(rgbaHex, rgbHex) {
            // 将RGBA和RGB颜色值从十六进制转换为对应的红、绿、蓝和透明度值
            const rgba = hexToRGBA(rgbaHex);
            const rgb = hexToRGB(rgbHex);

            //console.log(rgba,rgb);
            // 计算新的RGBA值，将各个通道进行加权平均
            const newRed = (rgba.red + rgb.red) / 2;
            const newGreen = (rgba.green + rgb.green) / 2;
            const newBlue = (rgba.blue + rgb.blue) / 2;
            const newAlpha = rgba.alpha; // 保持第一个颜色的透明度不变

            //console.log(newRed, newGreen, newBlue, newAlpha);
            // 将新的RGBA值转换回十六进制颜色表示法
            const combinedColorHex = rgbaToHex(newRed, newGreen, newBlue, newAlpha);

            return combinedColorHex;
        }

        function hexToRGBA(hex) {
            // 从RGBA十六进制表示法中提取红、绿、蓝和透明度值
            const bigint = parseInt(hex.slice(1), 16);
            const red = (bigint >> 24) & 255;
            const green = (bigint >> 16) & 255;
            const blue = (bigint >> 8) & 255;
            const alpha = (bigint & 255) / 255; // 将透明度值归一化为 [0, 1] 范围

            return { red, green, blue, alpha };
        }

        function hexToRGB(hex) {
            // 从RGB十六进制表示法中提取红、绿、蓝值
            const bigint = parseInt(hex.slice(1), 16);
            const red = (bigint >> 16) & 255;
            const green = (bigint >> 8) & 255;
            const blue = bigint & 255;

            return { red, green, blue };
        }

        function rgbaToHex(red, green, blue, alpha) {
            // 将红、绿、蓝和透明度值转换为RGBA十六进制表示法
            const r = Math.round(red);
            const g = Math.round(green);
            const b = Math.round(blue);
            const a = Math.round(alpha * 255 / 2);

            //console.log(r,g,b,a,`#${(1 << 24) | (r << 16) | (g << 8) | b}${a.toString(16).padStart(2, '0')}`);
            return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}${a.toString(16).padStart(2, '0')}`;
        }
        if(!window.location.href.startsWith('https://www.luogu.com.cn/blog/')){
            let temp1 = document.querySelectorAll("div.card");
            for(let temp2 of temp1){
                if (!temp2.classList.contains("reply-editor")&&!temp2.classList.contains("modal-card")&&!temp2.classList.contains("reply-card")&&!temp2.classList.contains("float-card")){
                    temp2.style.backgroundColor = bgc;
                    temp2.style.color = txtc;
                }else{
                    temp2.style.backgroundColor = bgc.slice(0, -2);
                }
            }
            temp1 = document.querySelectorAll("div.edit-reply-container.in-position div.card.reply-editor.padding-default");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div.edit-reply-container.in-position div.card.reply-editor.padding-default");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div.am-modal-dialog");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.lg-article");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("nav.sidebar.lside.bar");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.operations");//题解区展开后底下的那一条
            for(let temp2 of temp1){
                temp2.style.backgroundColor = "#00000000";
            }
            temp1 = document.querySelectorAll("div.float.operations");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("span[data-v-386007e1][data-v-291a2998]");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-0910ec7f].l-card.container.type-burger");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.am-comment-bd");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("section.am-panel.am-panel-default.lg-summary");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;//console.log(combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2)))));
            }
            temp1 = document.querySelectorAll("div.text.lfe-form-sz-middle");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div.text.lform-size-middle");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-6d37938a].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-710aa612].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-2fea9e9e].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-561f1302].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-0fca37c7].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-0a88bc8f].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-7af121b4].l-card:not([data-v-31a2e64a-s])");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-3f1a702f].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-7dbd4f9a].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-696a49da].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-e01570a1][data-v-1399826c].l-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelector("main.lcolor-bg-grey-1 div[data-v-fc349d1c]:not([data-v-076e399a])");
            let temp2=temp1;
            if(temp2)temp2.style.backgroundColor = averageHexColor(bgc.slice(0,-2)+"1f",bgc);
            temp1 = document.querySelector("footer[data-v-14b843ef].lcolor-bg-grey-1");
            temp2=temp1;
            if(temp2&&opt==2)temp2.style.backgroundColor=bgc;
            else if(temp2)temp2.style.backgroundColor=combineColors(bgc,bgc1).slice(0,-2);
            temp1 = document.querySelector("footer[data-v-14b843ef].lcolor-bg-grey-1");
            temp2=temp1;
            if(temp2)temp2.style.color = averageHexColor(txtc,bgc);
            temp1 = document.querySelectorAll("button.exlg-emo-btn");// extend-luogu
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
                temp2.style.color = txtc;
                temp2.style.cursor = 'pointer';
            }
            temp1 = document.querySelectorAll("ul.mp-editor-menu.exlg-emo.exlg-show-emo.exlg-show-emo-long");// extend-luogu
            for(let temp2 of temp1){
                temp2.style.backgroundColor = combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2))));
                //console.log(combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2)))));
            }
            temp1 = document.querySelectorAll("span.exlg-window");// extend-luogu
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("span[data-v-71731098][data-v-19de5e77].lfe-caption");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.text.lfe-form-sz-small");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.cm-tooltip-autocomplete div");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.casket.cs-main");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.cs-header");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("textarea");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
                temp2.style.color = txtc;
                temp2.style.caretColor = txtc;
            }
            temp1 = document.querySelectorAll("input:not(div.searchAnywhere input)");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
                temp2.style.color = txtc;
                temp2.style.caretColor = txtc;
            }
            temp1 = document.querySelectorAll("section.am-panel:not(.am-panel-default.lg-summary)");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.mp-editor-toolbar");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.mp-preview-area");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.top-bar");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div[data-v-076e399a].label");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div.cm-tooltip-autocomplete span");
            for(let temp2 of temp1){
                temp2.style.color = "#ffffff";
            }
            temp1 = document.querySelectorAll("div.update-info.lfe-caption");
            for(let temp2 of temp1){
                temp2.style.color = averageHexColor(txtc,bgc);
            }
            temp1 = document.querySelectorAll("div[data-v-0197ce51].content");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("[data-v-0a88bc8f]:not(a[data-v-12b24cc3]):not([data-v-f21de448])");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div.mp-preview-content");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("a.row.title.link");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("a[data-v-12b24cc3][data-v-c1098b6a]");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div[data-v-291a2998].row span");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div[data-v-291a2998].row.title a[data-v-12b24cc3]");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("svg[data-v-0910ec7f].svg-inline--fa.fa-xmark");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("[data-v-1bcc9ca7]:not(a[data-v-12b24cc3])");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("[data-v-ea62153a]:not(svg):not([data-v-112a83fd-s])");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("[data-v-3f1a702f]:not([data-v-51efdf02-s]):not([data-v-c99a40b0])");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("[data-v-4be8f676]");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div.radio-group span");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div.radio-group div");
            for(let temp2 of temp1){
                temp2.style.color = txtc;
            }
            //temp1 = document.querySelectorAll("div.CodeMirror-gutters");
            //for(let temp2 of temp1){
            //    temp2.style.backgroundColor = bgc;
            //}
            temp1 = document.querySelectorAll("div.CodeMirror-scroll");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div.CodeMirror-cursor");
            for(let temp2 of temp1){
                temp2.style.borderLeft = "1px solid "+txtc;
            }
            temp1 = document.querySelectorAll("div.dropdown");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.section-list-container");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.message-block div.message");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = (chm)?(bgc):("#e8e8e8");
            }
            temp1 = document.querySelectorAll("div.drop");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.content-wrapper");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.btn-edit-reply");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("header.am-comment-hd");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = averageHexColor(bgc,averageHexColor(bgc,averageHexColor(bgc,'#7F7F7F')));
            }
            temp1 = document.querySelectorAll("div[data-v-f9624136][data-v-19de5e77].card.log.padding-default div[data-v-19de5e77][data-v-f9624136].author");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = averageHexColor(bgc,averageHexColor(bgc,averageHexColor(bgc,'#7F7F7F')));
            }
            temp1 = document.querySelectorAll("button[data-v-453d795e]:not(.selected)");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
                temp2.style.color = txtc;
                // 找到所有包含SVG图像的<img>元素
                const imgElements = temp2.querySelectorAll('img[data-v-453d795e][src^="data:image/svg+xml;base64,"]');

                // 定义要替换的颜色
                var tttttemp = hexToRGB(txtc);
                const newFillColor = `fill: rgba(${tttttemp.red},${tttttemp.green},${tttttemp.blue},1);`;

                imgElements.forEach(imgElement => {
                    // 获取原始的SVG文本
                    const originalSvgBase64 = imgElement.getAttribute('src').replace(/^data:image\/svg\+xml;base64,/, '');
                    const originalSvgText = atob(originalSvgBase64);

                    // 在SVG文本中查找并替换颜色
                    const modifiedSvgText = originalSvgText.replace(/fill: rgba\(0,0,0,0.65\);/g, newFillColor);

                    // 将修改后的SVG文本重新编码为Base64
                    const modifiedSvgBase64 = btoa(modifiedSvgText);

                    // 更新<img>元素的src属性
                    imgElement.setAttribute('src', `data:image/svg+xml;base64,${modifiedSvgBase64}`);
                });

            }
            temp1 = document.querySelectorAll("button[data-v-453d795e].selected");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = "";
                temp2.style.color = "";
            }
            temp1 = document.querySelectorAll("div.inner-card");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("code");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
                temp2.style.color = txtc;
            }
            temp1 = document.querySelectorAll("div.marked pre");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.sample-wrap.sample pre");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
            }
            temp1 = document.querySelectorAll("div.bottom.float-bottom");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc;
            }
            temp1 = document.querySelectorAll("div[data-v-b5709dda].bottom:not(.float-bottom)");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = "";
            }
            /*temp1 = document.querySelectorAll("div.swal2-popup.swal2-modal.swal2-show");
            for(let temp2 of temp1){
                temp2.style.backgroundColor = bgc.slice(0, -2);
                var temp11 = document.querySelector("h2.swal2-title");
                temp11.style.color = txtc;
            }*///如果不注释掉，“xx成功”的打钩会变的很奇怪，干脆不改了
            temp1 = document.querySelectorAll("div.marked h3.exlg-code-title.exlg-beautified-cbex");// exlg
            for(let temp2 of temp1){
                temp2.style.color = averageHexColor(txtc,bgc);
            }
        }
        if(ch1){
            //下面是右侧帖子的
            let c=document.querySelectorAll("div[data-v-5c428514].row-wrap div[data-v-e01570a1][data-v-5c428514-s].l-card:not(.comment)");
            for (let el of c) {var ee=el.querySelector("a.router-link-active.wrap");
                if (ee&&ee.textContent.includes("站务版")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor2))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("题目总版")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor3))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("学术版")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor4))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("灌水区")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor5))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("工单反馈版")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor6))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("小黑屋")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor7))}A0; color: var(--link-indicator-color);`;
                } else if (ee&&ee.textContent.includes("团队")) {
                    el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor8))}A0; color: var(--link-indicator-color);`;
                } else {// 题目讨论区
                    //洛谷的bug，目前不会显示小黑屋和团队，所以要重搞
                    var temp=document.querySelector("h1.lfe-h1");
                    if (temp&&temp.textContent.includes("小黑屋"))el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor7))}A0; color: var(--link-indicator-color);`;
                    else if(temp&&temp.textContent.includes("团队"))el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor8))}A0; color: var(--link-indicator-color);`;
                    else if(temp&&window.location.href.includes("discuss"))el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor3))}A0; color: var(--link-indicator-color);`;
                }
            }//改背景色
            //下面是首页的
            c=document.getElementsByClassName("am-panel lg-index-contest am-panel-primary");
            for (let el of c) {
                let x=el.querySelector("div.am-panel-bd div.lg-inline-up span.lg-small a:not([class])");
                //console.log(x,x.textContent);
                if(x){
                    if (x.textContent.includes("站务版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor2))}A0; color: var(--link-indicator-color);`;
                    } else if (x.textContent.includes("题目总版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor3))}A0; color: var(--link-indicator-color);`;
                    } else if (x.textContent.includes("学术版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor4))}A0; color: var(--link-indicator-color);`;
                    } else if (x.textContent.includes("灌水区")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor5))}A0; color: var(--link-indicator-color);`;
                    } else if (x.textContent.includes("工单反馈版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor6))}A0; color: var(--link-indicator-color);`;
                    } else if (x.textContent.includes("小黑屋")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor7))}A0; color: var(--link-indicator-color);`;
                    } else {// 题目讨论区
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor3))}A0; color: var(--link-indicator-color);`;
                    }
                }
            }//改背景色
            //这个是个人主页部分的
            c=document.querySelectorAll("div[data-v-fe28b16c].row");
            for (let el of c) {
                if(window.location.href.includes("#problem")||window.location.href.includes(".contest"))break;
                let x=el.querySelector("div.inner-card");
                if(x){
                    el=x;x=x.querySelector("div.post-source");
                    if (x&&x.innerHTML.includes("站务版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor2))}A0; color: var(--link-indicator-color);`;
                    } else if (x&&x.innerHTML.includes("题目总版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor3))}A0; color: var(--link-indicator-color);`;
                    } else if (x&&x.innerHTML.includes("学术版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor4))}A0; color: var(--link-indicator-color);`;
                    } else if (x&&x.innerHTML.includes("灌水区")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor5))}A0; color: var(--link-indicator-color);`;
                    } else if (x&&x.innerHTML.includes("工单反馈版")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor6))}A0; color: var(--link-indicator-color);`;
                    } else if (x&&x.innerHTML.includes("小黑屋")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor7))}A0; color: var(--link-indicator-color);`;
                    } else if (x&&x.innerHTML.includes("团队")) {
                        el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor8))}A0; color: var(--link-indicator-color);`;
                    } else {// 题目讨论区
                        if(!window.location.href.includes("article"))el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor3))}A0; color: var(--link-indicator-color);`;
                        else{x=el.querySelector("span[data-v-71731098][data-v-d131ad5e].lfe-caption");
                            if (x&&x.textContent.includes("题解")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol2))}A0; color: var(--link-indicator-color);`;
                            } else if (x&&x.textContent.includes("科技·工程")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol3))}A0; color: var(--link-indicator-color);`;
                            } else if (x&&x.textContent.includes("算法·理论")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol4))}A0; color: var(--link-indicator-color);`;
                            } else if (x&&x.textContent.includes("生活·游记")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol5))}A0; color: var(--link-indicator-color);`;
                            } else if (x&&x.textContent.includes("学习·文化课")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol6))}A0; color: var(--link-indicator-color);`;
                            } else if (x&&x.textContent.includes("休闲·娱乐")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol7))}A0; color: var(--link-indicator-color);`;
                            } else if (x&&x.textContent.includes("个人记录")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol8))}A0; color: var(--link-indicator-color);`;
                            } else if (x&&x.textContent.includes("闲话")) {
                                el.style.cssText=`background-color: ${lighterColor(lighterColor(articol9))}A0; color: var(--link-indicator-color);`;
                            }
                        }
                    }
                }
            }//改背景色
            c=document.querySelectorAll("div.discuss-container div.discuss");//团队
            for(let el of c)el.style.cssText=`background-color: ${lighterColor(lighterColor(newcolor8))}A0; color: var(--link-indicator-color);`;
        }

        function areColorsEqual(rgbString, hexString) {
            // 从RGB(A)字符串中提取R、G、B和A值（如果存在）
            function extractRGBValues(rgbString) {
                const regex = /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/;
                const matches = rgbString.match(regex);
                if (matches) {
                    const [, r, g, b, a] = matches;
                    return {
                        r: parseInt(r),
                        g: parseInt(g),
                        b: parseInt(b),
                        a: a ? parseFloat(a) : 1.0
                    };
                }
                return null;
            }
            // 从HEX字符串中提取RGB和A值（如果存在）
            function extractHexValues(hexString) {
                const regex = /^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/;
                const matches = hexString.match(regex);
                if (matches) {
                    const [, hexRGB, hexA] = matches;
                    const r = parseInt(hexRGB.substring(0, 2), 16);
                    const g = parseInt(hexRGB.substring(2, 4), 16);
                    const b = parseInt(hexRGB.substring(4, 6), 16);
                    const a = hexA ? parseInt(hexA, 16) / 255.0 : 1.0;
                    return {
                        r,
                        g,
                        b,
                        a
                    };
                }
                return null;
            }
            const rgbValues = extractRGBValues(rgbString);
            const hexValues = extractHexValues(hexString);
            if (
                rgbValues &&
                hexValues &&
                rgbValues.r === hexValues.r &&
                rgbValues.g === hexValues.g &&
                rgbValues.b === hexValues.b &&
                rgbValues.a === hexValues.a
            ) {
                return true;
            }
            return false;
        }

        //更改背景
        var zhuanl=document.querySelector("main.lcolor-bg-grey-1");
        var bodyElement = document.body;
        if(zhuanl){
            if(opt===1)zhuanl.style.background = bgc1;
            else if(opt){
                bodyElement.style.backgroundImage = bgi2;
                bodyElement.style.backgroundSize = 'cover';
                bodyElement.style.backgroundRepeat = 'no-repeat';
                bodyElement.style.backgroundAttachment = 'fixed';
                zhuanl.style.backgroundColor = 'transparent';
            }
        }
        var mainElement = document.querySelector('.wrapped.lfe-body.mobile-body');
        if (!mainElement) mainElement = document.querySelector('.lfe-body.mobile-body');
        if (!mainElement) mainElement = document.querySelector('main[data-v-51efdf02]');
        if (mainElement) {
            if (opt === 1) {
                mainElement.style.background = bgc1;
            } else if (opt) {
                bodyElement.style.backgroundImage = bgi2;
                bodyElement.style.backgroundSize = 'cover';
                bodyElement.style.backgroundRepeat = 'no-repeat';
                bodyElement.style.backgroundAttachment = 'fixed';
                mainElement.style.backgroundColor = 'transparent';
            }
            // 更改完正常的背景，还需要顺便更改顶栏背景颜色
            let tmp = document.querySelector('div.wrapper.wrapped.lfe-body.header-layout.tiny');
            if (tmp) {// 有顶栏
                backgroundDivs = tmp.querySelectorAll('div.background');
                backgroundDivs.forEach(function (div) {
                    if (div.style.backgroundImage && BGI === "") {
                        BGI = div.style.backgroundImage;
                    }
                    if ((opt === 1 && !areColorsEqual(div.style.backgroundColor, bgc1)) || (opt === 2 && !areColorsEqual(div.style.backgroundColor, '#00000000'))) {
                        BGC = div.style.backgroundColor;
                    }
                    if (div.style.filter && FIL === "") {
                        FIL = div.style.filter;
                    }
                    div.style.filter = "";
                    div.style.backgroundImage = "";
                    if (opt === 1) {
                        div.style.backgroundColor = bgc1;
                    } else if (opt) {
                        div.style.backgroundColor = '#00000000';
                    }
                });
                if(delzt){
                    tmp = document.querySelector('div.wrapper.wrapped.lfe-body:not(.header-layout)');
                    if(tmp){
                        tmp=tmp.querySelector('div.background');
                        tmp.style.filter = "";
                        tmp.style.backgroundImage = "";
                        if (opt === 1) {
                            tmp.style.backgroundColor = bgc1;
                        } else if (opt) {
                            tmp.style.backgroundColor = '#00000000';
                        }
                    }
                }
            } else {// 没有，改回去
                //console.log("else");
                if(!delzt){
                    tmp = document.querySelector('div.wrapper.wrapped.lfe-body.header-layout.narrow');
                    if(!tmp)tmp = document.querySelector('div.wrapper.wrapped.lfe-body.header-layout.normal');
                    if(tmp){
                        backgroundDivs = tmp.querySelectorAll('div.background');
                        backgroundDivs.forEach(function (div) {
                            if (FIL) div.style.filter = FIL;
                            if (BGI) div.style.backgroundImage = BGI;
                            if (BGC) div.style.backgroundColor = BGC;
                        });
                    }
                }else{
                    tmp = document.querySelector('div.wrapper.wrapped.lfe-body.header-layout');
                    if(tmp){
                        tmp=tmp.querySelector('div.background');
                        tmp.style.filter = "";
                        tmp.style.backgroundImage = "";
                        if (opt === 1) {
                            tmp.style.backgroundColor = bgc1;
                        } else if (opt) {
                            tmp.style.backgroundColor = '#00000000';
                        }
                        tmp = document.querySelector('div.wrapper.wrapped.lfe-body:not(.header-layout)').querySelector('div.background');;
                        tmp.style.filter = "";
                        tmp.style.backgroundImage = "";
                        if (opt === 1) {
                            tmp.style.backgroundColor = bgc1;
                        } else if (opt) {
                            tmp.style.backgroundColor = '#00000000';
                        }
                    }
                }
            }
        }
        // 删除 exlg 插件在 luogu.org 右下角造出的神奇玩意
        // 以下由 ChatGPT 编写
        // 递归函数，用于遍历并删除当前元素的子元素中包含 "exlg" 的元素
        function removeElementsWithExlg(element) {
            const children = element.children;
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                if (child.outerHTML.includes("exlg")) {
                    // 如果子元素包含 "exlg"，则删除它
                    element.removeChild(child);
                } else {
                    // 否则继续递归遍历
                    removeElementsWithExlg(child);
                }
            }
        }
        // 调用函数，从整个文档开始遍历
        if(window.location.href === 'https://www.luogu.org/'){removeElementsWithExlg(document.body);}

        // 更改字体颜色
        var targetCSS1 = [
            ".lfe-body{",
            `    color: ${txtc};`,
            "}",
            ".message-block.left > .message[data-v-5c0627c6]:after {",
            `    border-right-color: ${(chm)?(bgc):("#e8e8e8")}!important;`,
            "}",
            ".message-block.right > .message[data-v-5c0627c6]:after {",
            `    border-left-color: ${(chm)?(bgc):("#e8e8e8")}!important;`,
            "}",
            ".item[data-v-4d6dca7a]:hover {",
            `    background-color: ${averageHexColor(txtc,bgc)}!important;`,
            "}",
            "li[data-v-4bbcea26]:hover {",
            `    background-color: ${averageHexColor(txtc,bgc)}!important;`,
            "}",
            ".expand[data-v-f3aa455a] {",
            `    background: linear-gradient(rgba(255, 255, 255, 0), ${combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2))))})!important;`,
            "}",
            ".expand[data-v-602e5c62] {",
            `    background: linear-gradient(rgba(255, 255, 255, 0), ${combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2))))})!important;`,
            "}",
            ".expand[data-v-15e4f65b] {",
            `    background: linear-gradient(rgba(255, 255, 255, 0), ${combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2))))})!important;`,
            "}",
            ".expand[data-v-4af4731c] {",
            `    background: linear-gradient(rgba(255, 255, 255, 0), ${combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2))))})!important;`,
            "}",
            ".expand[data-v-0fca37c7] {",
            `    background: linear-gradient(rgba(255, 255, 255, 0), ${combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2))))})!important;`,
            "}",
            ".expand[data-v-ea62153a] {",
            `    background: linear-gradient(rgba(255, 255, 255, 0), ${combineColors(bgc,((opt == 1)?(bgc1):(bgc.slice(0,-2))))})!important;`,
            "}",
            ".expand-tip > span[data-v-e4b7c2ca] {",
            `    color: ${averageHexColor(txtc,bgc)};!important;`,
            "}",
            `input::input-placeholder{color:  ${averageHexColor(txtc,bgc)} !important;}`,
            "::-webkit-input-placeholder { /* WebKit browsers */",
            `    color: ${averageHexColor(txtc,bgc)} !important;`,
            "}",
            ":-moz-placeholder { /* Mozilla Firefox 4 to 18 */",
            `    color: ${averageHexColor(txtc,bgc)} !important;`,
            "}",
            "::-moz-placeholder { /* Mozilla Firefox 19  */",
            `    color: ${averageHexColor(txtc,bgc)} !important;`,
            "}",
            ":-ms-input-placeholder { /* Internet Explorer 10  */",
            `    color: ${averageHexColor(txtc,bgc)} !important;`,
            "}",
            ".action > *[data-v-d05d45ec] {",
            `    color: ${averageHexColor(txtc,bgc)} !important;`,
            "}",
            ".action > *[data-v-4af4731c] {",
            `    color: ${averageHexColor(txtc,bgc)} !important;`,
            "}",
            ".button-2line>.icon[data-v-1ddadd0a] {",
            `    color: ${averageHexColor(txtc,bgc)} ;`,
            "}",
            ".button-2line>.text[data-v-1ddadd0a] {",
            `    color: ${averageHexColor(txtc,bgc)} ;`,
            "}",
            ".button-2line[data-v-1ddadd0a]:hover>*, .button-2line.active[data-v-1ddadd0a]>* {",
            `    color: var(--lfe-color--primary) ;`,
            "}",
            ".solution-article .operations .button.enable[data-v-ea62153a] {",
            `    color: rgb(var(--lcolor--primary)) !important;`,
            "}",
            ".reply-editor[data-v-710aa612] {",
            `    background-color: ${bgc.slice(0, -2)} !important;`,
            "}",
            ".section-list-container .section-item[data-v-a623cdfc]:hover, .section-list-container .section-item[data-v-a623cdfc]:active {",
            `    background-color: ${averageHexColor(txtc,bgc)} !important;`,
            "}",
            ".lfe-form-sz-tiny {",
            "  font-size: 0.875em;",
            "  padding: 0.0625em 0.25em;",
            "}",
            ".comment .author[data-v-2fea9e9e] {",
            `  background-color: ${bgc}`,
            "}",
            ".reply-item>.meta[data-v-6784177c] {",
            `  background-color: ${bgc}`,
            "}",
            ".action > *[data-v-561761e6] {",
            `  color: ${txtc}`,
            "}",
            ".color-default[data-v-0640126c][data-v-561761e6] {",
            `  color: ${averageHexColor(txtc,bgc)}`,
            "}",
            ".color-default[data-v-0640126c][data-v-561761e6][data-v-15e4f65b]{",
            "  color: #3498db;",
            "}",
            ".color-default[data-v-0640126c][data-v-561761e6]:hover {",
            `  color: #0056b3;`,
            "}",
            "[data-v-429fbdfe] .select-header-tiny .selected>span{",
            "  color: var(--l-simple-select--color,var(--lfe-color--primary,#3498db))!important",
            "}",
            ".wrap:hover>.name[data-v-88d5ecf4], .wrap.active>.name[data-v-88d5ecf4] {",
            `  color: var(--link-indicator-color, ${txtc})!important`,
            "}",
        ].join('\n');
        var existingStyles1 = document.querySelectorAll("style");
        var lastLines1 = "";
        let f1 = 0;
        for (let i = 0; i < existingStyles1.length; i++) {
            var style1 = existingStyles1[i];
            var styleText1 = style1.textContent || style1.innerText;
            var lines1 = styleText1.split('\n');
            var numLinesToCheck1 = lines1.length;
            if (lines1.length >= numLinesToCheck1) {
                lastLines1 = lines1.slice(-numLinesToCheck1).join('\n');
                if (lastLines1 === targetCSS1) {
                    f1 = 1;
                    break;
                }
            }
        }
        if(f1){}
        else if (typeof GM_addStyle != "undefined") {
            GM_addStyle(targetCSS1);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(targetCSS1);
        } else if (typeof addStyle != "undefined") {
            addStyle(targetCSS1);
        } else {
            var node1 = document.createElement("style");
            node1.type = "text/css";
            node1.appendChild(document.createTextNode(targetCSS1));
            var heads1 = document.getElementsByTagName("head");
            if (heads1.length > 0) {
                heads1[0].appendChild(node1);
            } else {
                document.documentElement.appendChild(node1);
            }
        }
        let tmp1 = document.querySelectorAll('strong:not(a strong)');
        if(tmp1){
            for(var sb of tmp1)sb.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('li:not(.selected)');
        if(tmp1){
            for(var sb1 of tmp1)sb1.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('li.menu.active-menu');
        if(tmp1){
            for(var seb1 of tmp1)seb1.style.color = '';
        }
        tmp1 = document.querySelectorAll('li[data-v-01f8a102]');
        if(tmp1){
            for(var seb22 of tmp1){
                seb22.style.color = txtc;
                var tmmp2 = seb22.querySelector('span');
                tmmp2.style.color = "";
            }
        }
        tmp1 = document.querySelectorAll('li[data-v-01f8a102].selected');
        if(tmp1){
            for(var seb223 of tmp1){
                seb223.style.color = "";
                var tmmp23 = seb223.querySelector('span');
                tmmp23.style.color = "";
            }
        }
        tmp1 = document.querySelectorAll('a[data-v-a97ae32a]');
        if(tmp1){
            for(var s_b of tmp1)s_b.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('span[data-v-ea62153a].lfe-caption');
        if(tmp1){
            for(let s_b of tmp1)s_b.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('span[data-v-ea62153a].lfe-caption time');
        if(tmp1){
            for(let s_b of tmp1)s_b.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('a[data-v-12b24cc3][data-v-ea62153a]');
        if(tmp1){
            for(let s_b of tmp1)if(s_b.innerHTML.includes("查看文章"))s_b.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div[data-v-0bcd986d]');
        if(tmp1){
            for(var s1b of tmp1)s1b.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('span[data-v-0bcd986d]');
        if(tmp1){
            for(var bs of tmp1)bs.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('div.delete');
        if(tmp1){
            for(var bss of tmp1)bss.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('div.content.marked');
        if(tmp1){
            for(var bbss of tmp1)bbss.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('div.content.marked p');
        if(tmp1){
            for(var bbssp of tmp1)bbssp.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('div.am-modal-hd');
        if(tmp1){
            for(var bbss1 of tmp1)bbss1.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('div.am-modal-bd');
        if(tmp1){
            for(var bbss2 of tmp1)bbss2.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('div.title');
        if(tmp1){
            for(var bbs of tmp1)bbs.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('span.item-title');
        if(tmp1){
            for(var lgbbs of tmp1)lgbbs.style.color = txtc;
        }
        tmp1 = document.querySelectorAll("i.am-icon-minus");
        for(var abcaa of tmp1){
            abcaa.style.color=txtc;
        }
        tmp1 = document.querySelectorAll("span[data-v-386007e1][data-v-79cbc3ff]");
        for(let abcaa of tmp1){
            abcaa.style.color="#ffffff";
        }
        // 定义一个函数来替换字符串中的内容
        function replaceTextContent(element) {
            // 获取元素的源码
            var html = element.innerHTML;
            // 将"Highcharts.getOptions().colors[数字]"替换为 txtc
            html = html.replace(/Highcharts\.getOptions\(\)\.colors\[\d+\]/g, txtc);
            // 将"#666666"替换为 averageHexColor(txtc,bgc) 返回的值
            html = html.replace(/#666666/g, averageHexColor(txtc,bgc));
            // 更新元素的源码
            if(element.innerHTML != html)element.innerHTML = html;
        }
        var divs = document.querySelectorAll('g.highcharts-axis.highcharts-yaxis');
        for (var i11 = 0; i11 < divs.length; i11++) {
            replaceTextContent(divs[i11]);
        }
        var divs1 = document.querySelectorAll('.highcharts-axis-labels');
        for (var i111 = 0; i111 < divs1.length; i111++) {
            replaceTextContent(divs1[i111]);
        }
        tmp1 = document.querySelectorAll('[data-v-04eb14e9][data-v-f9624136]:not(ul.luogu):not(path):not(svg):not(span.clear-filter):not(span.hide-on-narrow)');
        if(tmp1){
            for (var ls of tmp1) {
                if (!ls.closest('li')&&ls.className!="block-item tag"&&ls.className!="color-default"&&ls.className!="combo-wrapper block-item combo"&&ls.className!="delete") {
                    if(ls.className!="block-item select-button lfe-form-sz-middle"&&ls.className!="result-count"&&ls.className!="lfe-caption")ls.style.color = txtc;
                    else ls.style.color = averageHexColor(txtc,bgc);
                }else{
                    ls.style.color = "";
                }
            }
        }
        tmp1 = document.querySelectorAll('span.lfe-placeholder');
        if(tmp1){
            for(var lss of tmp1)if(lss.textContent=="题目难度")lss.style.color=averageHexColor(txtc,bgc);else lss.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('span.result-count');
        if(tmp1){
            for(let lss of tmp1){
                lss.style.color = txtc;
                lss=lss.querySelector('span.number');
                lss.style.color = txtc;
            }
        }
        tmp1 = document.querySelectorAll('span.exlg-windiv-left-tag');// exlg
        if(tmp1){
            for(var exlgbbs of tmp1)exlgbbs.style.color = txtc;
        }
        tmp1 = document.querySelectorAll('span[id="version-text"]');// exlg
        if(tmp1){//console.log(1);
            for(var exlgs of tmp1){
                var firstSpan = exlgs.querySelector('span[title="当前版本"]');
                firstSpan.style.color = txtc;
                var thirdSpan = exlgs.querySelector('span[title="最新版本"]');
                if(thirdSpan)thirdSpan.style.color = txtc;
            }
        }
        tmp1 = document.querySelectorAll('span.info-content');
        if(tmp1){
            for(var ssb of tmp1)ssb.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div.lfe-caption.grey');
        if(tmp1){
            for(var ssb1 of tmp1)ssb1.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div.l-card.comment div.time');
        if(tmp1){
            for(var ssb2 of tmp1)ssb2.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div[data-v-291a2998].lfe-caption.time span');
        if(tmp1){
            for(let ssb2 of tmp1)ssb2.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div[data-v-291a2998].row.info div.time');
        if(tmp1){
            for(let ssb2 of tmp1)ssb2.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div[data-v-5c428514].row-wrap div.time');
        if(tmp1){
            for(let ssb2 of tmp1)ssb2.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div.article-actions.lfe-caption');
        if(tmp1){
            for(let ssb2 of tmp1){
                ssb2.style.color = averageHexColor(txtc,bgc);
                ssb2=ssb2.querySelector('span');
                ssb2.style.color = averageHexColor(txtc,bgc);
            }
        }
        //tmp1 = document.querySelectorAll('div.action a.color-default');
        //if(tmp1){
        //    for(var s2sb2 of tmp1)s2sb2.style.color = averageHexColor(txtc,bgc);
        //}
        tmp1 = document.querySelectorAll('div[data-v-1c7f56df][data-v-f9624136].lfe-caption.caption');
        if(tmp1){
            for(var sbp of tmp1)sbp.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div[data-v-98eaadf6][data-v-f9624136].hint.fa-pull-right');
        if(tmp1){
            for(var sbp1 of tmp1)sbp1.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('.lg-small');
        if(tmp1){
            for(var sbb of tmp1)sbb.style.color = averageHexColor(txtc,averageHexColor(txtc,bgc));
        }
        tmp1 = document.querySelectorAll('.lg-small.lg-inline-up');
        if(tmp1){
            for(var sssssssbb of tmp1)sssssssbb.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('span[data-v-71731098][data-v-c0f00ef2].lfe-caption');
        if(tmp1){
            for(var sssssssbbb of tmp1)sssssssbbb.style.backgroundColor = bgc.slice(0, -2);
        }
        tmp1 = document.querySelectorAll('div.am-comment-meta');
        if(tmp1){
            for(var ssbb of tmp1)ssbb.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div[data-v-4af4731c].author');
        if(tmp1){
            for(var ssbb1 of tmp1)ssbb1.style.backgroundColor = averageHexColor(bgc,averageHexColor(bgc,averageHexColor(bgc,'#7F7F7F')));
        }
        tmp1 = document.querySelectorAll('div[data-v-5e80acb2][data-v-18fb1b28][data-v-f9624136]');
        if(tmp1){
            for(var rg of tmp1)rg.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('span[data-v-18fb1b28][data-v-f9624136]');
        if(tmp1){
            for(var sy of tmp1)sy.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('div.meta');
        if(tmp1){
            for(var tc of tmp1)tc.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('span[data-v-530f8b1f].lfe-caption');
        if(tmp1){
            for(var tc1 of tmp1)tc1.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('time.time');
        if(tmp1){
            for(var sj of tmp1)sj.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('time[data-v-e7b78994]');
        if(tmp1){
            for(var bbsj of tmp1)bbsj.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('span[data-v-e7b78994]:not([class])');
        if(tmp1){
            for(var bbsw of tmp1)bbsw.style.color = averageHexColor(txtc,bgc);
        }
        tmp1 = document.querySelectorAll('span[data-v-bd496524].key');
        if(tmp1){
            for(var kp of tmp1)kp.style.color = averageHexColor(txtc,bgc);
        }
        var ttt=document.querySelectorAll(".am-panel.lg-index-contest.am-panel-primary .lg-small");
        for(var abc of ttt){
            //abc.style.color=txtc;
        }
        ttt=document.querySelectorAll("div[data-v-6f2f45fc][data-v-b5709dda].row div.inner-card time");
        for(abc of ttt){
            abc.style.color=txtc;/*console.log(1);*/
        }
        tmp1 = document.querySelectorAll('span[data-v-71731098][data-v-0bcd986d][data-v-f9624136].lfe-caption');
        for(abc of tmp1){
            abc.style.color="#ffffff";
        }
        // 滚动条总是在屏幕的固定的地方，太烦了
        /*bug 太多了，放弃了
        var dropdowns = document.querySelectorAll('div[data-v-4bbcea26].dropdown');
        for (var dropdown of dropdowns) {
            if(!(dropdown.innerHTML.includes("辱骂与不友善内容"))){
                dropdown.style.position = 'absolute';
                dropdown.style.left = '';
                dropdown.style.top = '';
            }
        }*/
        // 自定义题目标签
        if(cht){
            var dbits = document.querySelectorAll('div.block-item.tag');
            for(var dbit of dbits){
                //console.log(stn);
                var stn = dbit.style.cssText;
                if(stn == 'background-color: rgb(41, 73, 180);'){
                    dbit.style.backgroundColor = newsf;
                }if(stn == 'background-color: rgb(19, 194, 194);'){
                    dbit.style.backgroundColor = newly;
                }if(stn == 'background-color: rgb(52, 152, 219);'){
                    dbit.style.backgroundColor = newsj;
                }if(stn == 'background-color: rgb(82, 196, 26);'){
                    dbit.style.backgroundColor = newqy;
                }if(stn == 'background-color: rgb(243, 156, 17);'){
                    dbit.style.backgroundColor = newts;
                }
                stn = dbit.innerText;// 加空格为了防止类似“CSP-J 入门级”的 tag 变色
                //console.log(stn);
                if(stn.includes('暂无评定 ')){
                    dbit.style.backgroundColor = newzw;
                }if(stn.includes('入门 ')){
                    dbit.style.backgroundColor = newrm;
                }if(stn.includes('普及− ')){
                    dbit.style.backgroundColor = newpj;
                }if(stn.includes('普及/提高− ')){
                    dbit.style.backgroundColor = newpt;
                }if(stn.includes('普及+/提高 ')){
                    dbit.style.backgroundColor = newtp;
                }if(stn.includes('提高+/省选− ')){
                    dbit.style.backgroundColor = newtg;
                }if(stn.includes('省选/NOI− ')){
                    dbit.style.backgroundColor = newsx;
                }if(stn.includes('NOI/NOI+/CTSC ')){
                    dbit.style.backgroundColor = newht;
                }
            }
            dbits = document.querySelectorAll('a.tag.color-none span.lfe-caption');
            for(dbit of dbits){
                //console.log(stn);
                stn = dbit.style.cssText;
                if(stn == 'color: rgb(255, 255, 255); background: rgb(41, 73, 180);'){
                    dbit.style.background = newsf;
                }if(stn == 'color: rgb(255, 255, 255); background: rgb(19, 194, 194);'){
                    dbit.style.background = newly;
                }if(stn == 'color: rgb(255, 255, 255); background: rgb(52, 152, 219);'){
                    dbit.style.background = newsj;
                }if(stn == 'color: rgb(255, 255, 255); background: rgb(82, 196, 26);'){
                    dbit.style.background = newqy;
                }if(stn == 'color: rgb(255, 255, 255); background: rgb(243, 156, 17);'){
                    dbit.style.background = newts;
                }
            }
            dbits = document.querySelectorAll('div.difficulty a[data-v-0640126c][data-v-beeebc6e].color-default span.lfe-caption');
            for(dbit of dbits){
                stn = dbit.innerText;
                //console.log(stn);
                if(stn.includes('暂无评定')){
                    dbit.style.background = newzw;
                }if(stn.includes('入门')){
                    dbit.style.background = newrm;
                }if(stn.includes('普及−')){
                    dbit.style.background = newpj;
                }if(stn.includes('普及/提高−')){
                    dbit.style.background = newpt;
                }if(stn.includes('普及+/提高')){
                    dbit.style.background = newtp;
                }if(stn.includes('提高+/省选−')){
                    dbit.style.background = newtg;
                }if(stn.includes('省选/NOI−')){
                    dbit.style.background = newsx;
                }if(stn.includes('NOI/NOI+/CTSC')){
                    dbit.style.background = newht;
                }
            }
            dbits = document.querySelectorAll('a[data-v-0640126c][data-v-263e39b8].color-none span[data-v-263e39b8]');
            for(dbit of dbits){
                stn = dbit.innerText;
                //console.log(stn);
                if(stn.includes('暂无评定')){
                    dbit.style.color = newzw;
                }if(stn.includes('入门')){
                    dbit.style.color = newrm;
                }if(stn.includes('普及−')){
                    dbit.style.color = newpj;
                }if(stn.includes('普及/提高−')){
                    dbit.style.color = newpt;
                }if(stn.includes('普及+/提高')){
                    dbit.style.color = newtp;
                }if(stn.includes('提高+/省选−')){
                    dbit.style.color = newtg;
                }if(stn.includes('省选/NOI−')){
                    dbit.style.color = newsx;
                }if(stn.includes('NOI/NOI+/CTSC')){
                    dbit.style.color = newht;
                }
            }
            dbits = document.querySelectorAll('div[data-v-581a38cc] div[data-v-c4278d4c][data-v-581a38cc] div[data-v-2a31ee10][data-v-c4278d4c][data-v-581a38cc] div[data-v-2a31ee10].tag');
            for(dbit of dbits){
                stn = dbit.style.cssText;
                if(stn == 'background-color: rgb(41, 73, 180);'){
                    dbit.style.backgroundColor = newsf;
                }if(stn == 'background-color: rgb(19, 194, 194);'){
                    dbit.style.backgroundColor = newly;
                }if(stn == 'background-color: rgb(52, 152, 219);'){
                    dbit.style.backgroundColor = newsj;
                }if(stn == 'background-color: rgb(82, 196, 26);'){
                    dbit.style.backgroundColor = newqy;
                }if(stn == 'background-color: rgb(243, 156, 17);'){
                    dbit.style.backgroundColor = newts;
                }
            }
            dbits = document.querySelectorAll('div.tags span[data-v-71731098][data-v-32a8fe5a][data-v-abfce16a][data-v-f9624136].lfe-caption.tag.selected');
            for(dbit of dbits){
                stn = getComputedStyle(dbit).getPropertyValue("--tag-color");
                if(stn == '#2949b4'){
                    dbit.style.setProperty("--tag-color",newsf);
                }if(stn == '#13c2c2'){
                    dbit.style.setProperty("--tag-color",newly);
                }if(stn == '#3498db'){
                    dbit.style.setProperty("--tag-color",newsj);
                }if(stn == '#52c41a'){
                    dbit.style.setProperty("--tag-color",newqy);
                }if(stn == '#f39c11'){
                    dbit.style.setProperty("--tag-color",newts);
                }
            }
            dbits = document.querySelectorAll('div.tags span[data-v-71731098][data-v-32a8fe5a][data-v-abfce16a][data-v-f9624136].lfe-caption.tag:not(.selected)');
            for(dbit of dbits){
                dbit.style.setProperty("background",bgc);
            }
        }
        // 获取所有带有 data-v-31929e12 和 data-v-f9624136 属性的 div 元素
        var divsToRemove = document.querySelectorAll('div[data-v-f9624136][style="background-color: rgb(255, 235, 236); border-radius: 5px; border: 1px solid rgb(225, 50, 56); padding: 1em; font-style: italic;"]');
        // 遍历每个 div 元素并删除它们
        divsToRemove.forEach(function(div) {
            div.remove();
        });
        // 获取所有带有 data-v-e5ad98f0 和 data-v-b03c2e52 属性的 div 元素
        var divsToClearStyle = document.querySelectorAll('div[data-v-e5ad98f0]');
        // 遍历每个 div 元素并清空它们的 style 属性
        divsToClearStyle.forEach(function(div) {
            div.style = '';
        });
        // 找到网页中的 div.user-action 元素
        var userActionDiv = document.querySelector('div[data-v-59a020e0][data-v-f9624136].user-action');
        var loggedout = document.querySelector('a.login');
        if(userActionDiv&&!loggedout){
            var tmpttt = userActionDiv.querySelector('nbutton');
            var tmpttt2 = userActionDiv.querySelector('span');
            if(!tmpttt&&!tmpttt2){
                // 创建一个包含<a></a>代码的字符串
                var linkHtml = '<a data-v-0640126c="" data-v-7d9c5470="" href="/article/mine" class="color-none"><button data-v-cc52fb5c="" data-v-7d9c5470="" type="button" class="btn btn-config lfe-form-sz-middle" style="border-color: rgba(255, 255, 255, 0.5); color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.5);">我的专栏文章</button></a><nbutton type="not-button" class="btn btn-config lfe-form-sz-tiny" style="border-color: rgba(255, 255, 255, 1); color: rgb(255, 255, 255,1); background-color: rgba(0, 0, 0, 0);"></nbutton>'; // 这里可以是您想要显示的链接和文本内容
                // 将包含<a></a>代码的字符串插入到 div.user-action 元素的最前面
                if (userActionDiv) {
                    userActionDiv.insertAdjacentHTML('afterbegin', linkHtml);
                }
            }
        }


        //帖子列表右侧帖子字体颜色
        var elements = document.querySelectorAll('div.avatar-right');
        for (var i = 0; i < elements.length; i++) {
            let e1 = elements[i].querySelectorAll('a.row.content-left.title.link.color-default');
            for(let ee of e1)ee.style.color = txtc;
            let e2 = elements[i].querySelectorAll('div.time');
            for(let ee of e2)ee.style.color = /*averageHexColor(txtc,bgc)*/txtc;
            let e3 = elements[i].querySelectorAll('span.forum-name');
            for(let ee of e3)ee.style.color = txtc;
            let e4 = elements[i].querySelectorAll('g');
            for(let ee of e4)ee.style.color = txtc;
        }
        //帖子列表左侧栏字体颜色
        //elements = document.querySelector('div.colored-link-selector');
        //if(elements){
        elements = document.querySelector('div.colored-link-selector');
        if(elements){
            let e1 = elements.querySelectorAll('a');
            for (let ee of e1) {
                let e2List = ee.querySelectorAll('span');
                for (let e2 of e2List) {
                    if (ee.classList.contains('active')) {//console.log(ee);
                        e2.style.color = ee.style.color; // 清除style.color属性
                    } else {
                        e2.style.color = txtc;
                    }
                }
            }
        }
        //竖屏页面字体颜色显示问题
        elements = document.querySelector('div[data-v-a623cdfc][data-v-7daab60c-s].section-list-container');
        if(elements){
            let e1 = elements.querySelectorAll('a');
            for (let ee of e1) {
                let e2List = ee.querySelectorAll('span');
                for (let e2 of e2List) {
                    if (ee.classList.contains('active')) {//console.log(ee);
                        e2.style.color = ee.style.color; // 清除style.color属性
                    } else {
                        e2.style.color = txtc;
                    }
                }
            }
        }
        //}

    }
    //更新速度，单位毫秒，太小可能造成卡顿
    setInterval(changeColors, 250);
})();
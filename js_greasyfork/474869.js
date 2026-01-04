


// ==UserScript==
// @name         Peacock Setaria Luogu 狗尾草洛谷
// @namespace    http://tampermonkey.net/
// @version      0.8.8.2
// @description  更改洛谷主题颜色，支持自定义。
// @author       jia123456
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474869/Peacock%20Setaria%20Luogu%20%E7%8B%97%E5%B0%BE%E8%8D%89%E6%B4%9B%E8%B0%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/474869/Peacock%20Setaria%20Luogu%20%E7%8B%97%E5%B0%BE%E8%8D%89%E6%B4%9B%E8%B0%B7.meta.js
// ==/UserScript==


(function () {
    'use strict';//说明： 感谢洛谷用户 @cff_0102 给予开发资助，此插件曾向 @cff_0102 借鉴了部分内容
    function hexToRgb(hex) { hex = hex.replace(/^#/, ''); const bigint = parseInt(hex, 16); const r = (bigint >> 16) & 255; const g = (bigint >> 8) & 255; const b = bigint & 255; return { r, g, b }; }
    function lighterColor(hex) { hex = hex.replace(/^#/, ''); const bigint = parseInt(hex, 16); let r = (bigint >> 16) & 255; let g = (bigint >> 8) & 255; let b = bigint & 255; r = Math.floor(255 - (255 - r) / 2); g = Math.floor(255 - (255 - g) / 2); b = Math.floor(255 - (255 - b) / 2); const newHex = ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1); return `#${newHex}`; }
    function ff() {//以下是自定义洛谷各版块颜色的代码
        const qbColor = '#a0a0a0'; // “全部板块”的颜色
        const zwColor = '#F01010'; // “站务版”的颜色
        const tmColor = '#F0B810'; // “题目总版”的颜色
        const xsColor = '#9CF010'; // “学术版”的颜色
        const gsColor = '#10F0D4'; // “灌水区”的颜色
        const fkColor = '#109CF0'; // “工单反馈版”的颜色
        const hwColor = '#8010F0'; // “小黑屋”的颜色
        const tdColor = '#F010D4'; // 团队内帖子的颜色
        const tzdlColor = '#101010';// 讨论区帖子顶栏颜色
        const ch = 1;// 是否更改背景色（0 或 1 或 2）（0: 默认背景， 1: 透明背景， 2: 不透明背景）
        const bg = "#303030";// 更改背景图像地址或颜色，默认为 #EFEFEF
        //const bbColor = "#000000";// 犇犇颜色，默认为 #FFFFFF
        const txColor = "#f0f0f0";// 更改文字颜色，默认为 #FF0000
        const txColor2 = "#a0a0a0";// 更改小字颜色，默认为 #808080
        const kpColor = "#202020";// 更改卡片颜色，默认为 #FFFFFF
        const kpColor2 = "#303030";// 更改迷你卡片颜色，默认为 #FAFAFA
        const qtColor = 0;// 除讨论区外帖子（比如首页动态等）是否变色（0 或 1 或 2）（0: 默认不变， 1: 透明背景， 2: 不透明背景）
        const tbColor = "#505050";// 更改图标颜色，如果为 "" 则使用默认模式
        const tcColor = "#505050";// 更改图床图标颜色，默认为 #FAFAFA
        const txzColor = "#f0f0f0";// 更改讨论区左侧栏目文字颜色，默认为 #333333
        const bjColor = "#202020";// 更改“编辑回复”颜色，默认为 #F0F0F0
        const dlColor = "#202020";// 更改顶栏颜色，默认为 #FFFFFF
        const dlColor2 = "#f0f0f0";// 更改顶栏图标与文字颜色，默认为 #333333
        const syLianXiGai = 0;// 是否更改首页“练习”背景色（ 0 或 1 ）（0: 默认不变， 1: 改变）
        const sskColor = 1;// 是否更改搜索框颜色（ 0 或 1 ）（0: 默认不变， 1: 改变）
        const txColor3 = "#e0e0e0";// 更改题解“时间”颜色，默认为 #595959
        // 更改上面的设置即可更改显示效果
        // 建议在某个地方保存自己的设置，以免更新时回到原来的设置
        /*
                附：
                1. 洛谷原版色系：
                const qbColor = '#272727'; // “全部板块”的颜色
                const zwColor = '#14558f'; // “站务版”的颜色
                const tmColor = '#f39c11'; // “题目总版”的颜色
                const xsColor = '#9d9dcf'; // “学术版”的颜色
                const gsColor = '#52c41a'; // “灌水区”的颜色
                const fkColor = '#2949b4'; // “工单反馈版”的颜色
                const hwColor = '#272727'; // “小黑屋”的颜色
                const tdColor = '#272727'; // 团队内帖子的颜色
                const ch = 1;// 是否更改背景色（0 或 1 或 2）（0: 默认背景， 1: 透明背景， 2: 不透明背景）
                const bg = "#EFEFEF";// 更改背景图像地址或颜色，默认为 #EFEFEF
                */
        const hrefTmp = window.location.href;
        var opt;
        if (bg[0] == "#") {
            opt = 1;
        } else {
            opt = 0;
        }
        var tmpGxC = 0;
        var kpColorT = kpColor;
        if (kpColorT.length == 7) {
            kpColorT += "FF";
        }
        if (hrefTmp.slice(0, 29) === "https://www.luogu.com.cn/user") {
            tmpGxC = 1;
        }
        /*const tmpTmp2 = document.getElementsByTagName("button");
        for (let ite of tmpTmp2) {
            ite.style.cssText += `background-color: ${tbColor};`;
        }*/
        //优化图床颜色
        if (hrefTmp.slice(0, 30) == "https://www.luogu.com.cn/image" && tcColor != "") {
            document.getElementsByClassName("drop")[0].style.cssText = `background-color: ${tcColor}`;
            const tmp = document.getElementsByClassName("radio-group")[0].children;
            for (let ite of tmp) {
                if (ite.className != "forum-name active") {
                    ite.style.cssText = `color: ${txColor}`;
                }
            }
        }
        // 优化“编辑回复”颜色
        const tmpBj = document.getElementsByClassName("btn-edit-reply");
        if (tmpBj.length >= 1) {
            tmpBj[0].style.cssText = `background-color: ${bjColor}`;
        }
        //优化讨论区左侧栏目文字颜色
        if (hrefTmp.slice(0, 36) === "https://www.luogu.com.cn/discuss/new") {
            const tmp = document.getElementsByClassName("card padding-default");
            if (tmp.length >= 1) {
                var z = 0;
                stdChk = 0;
                const tmp2 = tmp[0].getElementsByClassName("forum-name");
                //const tmp3 = tmp[0].getElementsByClassName("forum-name active")[0];
                //console.log(tmp3);
                for (let ite of tmp2) {
                    if (hrefTmp === "https://www.luogu.com.cn/discuss/new?forum=siteaffairs" && z == 0) {
                        ite.style.cssText = `color: ${zwColor};`;
                        stdChk = 1;
                        z += 1;
                        continue;
                    } else if (hrefTmp === "https://www.luogu.com.cn/discuss/new?forum=problem" && z == 1) {
                        ite.style.cssText = `color: ${tmColor};`;
                        stdChk = 1;
                        z += 1;
                        continue;
                    } else if (hrefTmp === "https://www.luogu.com.cn/discuss/new?forum=academics" && z == 2) {
                        ite.style.cssText = `color: ${xsColor};`;
                        stdChk = 1;
                        z += 1;
                        continue;
                    } else if (hrefTmp === "https://www.luogu.com.cn/discuss/new?forum=relevantaffairs" && z == 3) {
                        ite.style.cssText = `color: ${gsColor};`;
                        stdChk = 1;
                        z += 1;
                        continue;
                    } else if (hrefTmp === "https://www.luogu.com.cn/discuss/new?forum=service" && z == 4) {
                        ite.style.cssText = `color: ${fkColor};`;
                        stdChk = 1;
                        z += 1;
                        continue;
                    } else if (z == 5) {
                        if (hrefTmp.search("forum=g") != -1) {
                            ite.style.cssText = `color: ${tdColor};`;
                        } else {
                            ite.style.cssText = `color: ${tmColor};`;
                        }
                        continue;
                    }
                    //if (ite != tmp3) {
                    ite.style.cssText = `color: ${txzColor};`;
                    //}
                    z += 1;
                }
            }
        }
        // 优化“展开” 颜色
        const tmpZk = document.getElementsByClassName("expand");
        for (let ite of tmpZk) {
            ite.style.background = `linear-gradient(rgba(0, 0, 0, 0), ${kpColorT})`;
        }
        //优化题目目录颜色
        const tmpMuLu = document.getElementsByClassName("bottom float-bottom");
        if (tmpMuLu.length >= 1) {
            tmpMuLu[0].style.cssText = `background-color: ${kpColorT}; color: ${txColor};`;
        }
        //优化题目搜索颜色
        const tmpTmp = document.getElementsByClassName("title no-wrap");
        for (let ite of tmpTmp) {
            ite.style.cssText = `color: ${txColor}`;
        }
        const tmpT = document.getElementsByClassName("result-count");
        for (let ite of tmpT) {
            ite.style.cssText = `color: ${txColor};`;
            const tmp = ite.getElementsByClassName("number");
            for (let ite2 of tmp) {
                ite2.style.cssText = `color: ${txColor};`;
            }
        }
        // “选择题目类型”弹窗
        if (hrefTmp.slice(0, 37) === "https://www.luogu.com.cn/problem/list") {
            document.getElementsByClassName('lfe-caption')[2].style.cssText = `color: ${txColor}80;`;
            const tmp = document.getElementsByClassName("card info-card center padding-default");
            if (tmp.length >= 1) {
                const tmp2 = tmp[0].getElementsByClassName("title");
                for (let ite of tmp2) {
                    ite.style.cssText = `color: ${txColor};`;
                }
                var colorStr;
                const tmpStr = tmp[0].getElementsByClassName("entry selected")[0].innerText;
                if (tmpStr === "算法") {
                    colorStr = "#2949b4";
                } else if (tmpStr === "来源") {
                    colorStr = "#13c2c2";
                } else if (tmpStr === "时间") {
                    colorStr = "#3498db";
                } else if (tmpStr === "区域") {
                    colorStr = "#52c41a";
                } else {
                    colorStr = "#f39c11";
                }
                const tmp3 = tmp[0].getElementsByClassName("lfe-caption tag");
                for (let ite of tmp3) {
                    ite.style.cssText = `background: ${kpColorT.slice(0, 7)} none repeat scroll 0% 0%; border: 1px solid rgb(191, 191, 191); --tag-color: ${colorStr};`;
                }
                const tmp4 = tmp[0].getElementsByClassName("lfe-caption tag selected");
                for (let ite of tmp4) {
                    ite.style.cssText = `background: ${kpColorT.slice(0, 7)} none repeat scroll 0% 0%; border: 1px solid rgb(191, 191, 191); --tag-color: ${colorStr};`;
                }
            }
        } else {
            const tmp = document.getElementsByClassName("card center padding-default");
            for (let ite of tmp) {
                ite.style.cssText = `color: ${txColor}; background-color: ${kpColorT}`;
            }
        }
        // 警告弹窗（比如退出团队的弹窗）
        const tmpTc = document.getElementsByClassName("swal2-popup swal2-modal swal2-show");
        for (let ite of tmpTc) {
            ite.style.cssText = `display: flex; background-color: ${kpColorT}`;
            const tmpTcWz = ite.getElementsByClassName("swal2-title");
            for (let ite2 of tmpTcWz) {
                ite2.style.cssText = `display: flex; color: ${txColor}`;
            }
        }
        // 记录
        const tmpJiLu = document.getElementsByClassName("text lfe-form-sz-small");
        for (let ite of tmpJiLu) {
            ite.style.cssText = "color: #404040";
        }
        const tmpJiLu2 = document.getElementsByClassName("text lfe-form-sz-middle");
        for (let ite of tmpJiLu2) {
            ite.style.cssText = "color: #404040";
        }
        // 代码框
        const tmpDm = document.getElementsByTagName("pre");
        for (let ite of tmpDm) {
            ite.style.cssText += "color: #404040";
        }
        const tmpDm2 = document.getElementsByTagName("code");
        for (let ite of tmpDm2) {
            ite.style.cssText += "color: #404040";
        }
        const tmpGx = document.getElementsByClassName("user-info");
        for (let ite of tmpGx) {
            if (tmpGxC == 0) {
                ite.style.cssText = "background-color: white; color: #404040";//修复个人信息页面
            }
            tmpGxC = 0;
        }
        //if (hrefTmp.slice(0, 29) === "https://www.luogu.com.cn/user") {
        const tmpUsS = document.getElementsByClassName("inner-card");
        for (let ite of tmpUsS) {
            ite.style.cssText = `background-color: ${kpColor2}; color: ${txColor}`;//修复个人信息页面
        }
        //}
        //const tmpJian = document.getElementsByClassName("text lfe-form-sz-small")
        if (hrefTmp.slice(0, 29) === "https://www.luogu.com.cn/team" && hrefTmp.search("#file") != -1) {
            const tmp = document.getElementsByClassName("inner-card");
            for (let ite of tmp) {
                ite.getElementsByClassName("color-default")[0].style.cssText = `color: ${txzColor}`;
            }
        }// 优化团队附件的颜色
        if (qtColor == 1 || qtColor == 2) {
            if (hrefTmp.slice(0, 29) === "https://www.luogu.com.cn/team") {
                const tmp = document.getElementsByClassName("discuss");
                for (let ite of tmp) {
                    if (qtColor == 1) {
                        ite.style.cssText = `background-color: ${tdColor}40;`;
                    } else if (qtColor == 2) {
                        ite.style.cssText = `background-color: ${tdColor};`;
                    }
                }
            }
            if (hrefTmp.slice(0, 29) === "https://www.luogu.com.cn/user" && hrefTmp.search('#mine') != -1 &&
                hrefTmp.search('#mine.contest') == -1 && hrefTmp.search('#mine.team') == -1) {
                const tmp = document.getElementsByClassName("inner-card");
                for (let ite of tmp) {
                    const tmp2 = ite.getElementsByClassName("color-none")[1].innerText;
                    if (qtColor == 1) {
                        if (tmp2 === "灌水区") {
                            ite.style.cssText = `background-color: ${gsColor}40;`;
                        } else if (tmp2 === "学术版") {
                            ite.style.cssText = `background-color: ${xsColor}40;`;
                        } else if (tmp2 === "站务版") {
                            ite.style.cssText = `background-color: ${zwColor}40;`;
                        } else if (tmp2 === "工单反馈版") {
                            ite.style.cssText = `background-color: ${fkColor}40;`;
                        } else if (tmp2 === "小黑屋") {
                            ite.style.cssText = `background-color: ${hwColor}40;`;
                        } else if (tmp2.startsWith("团队")) {
                            ite.style.cssText = `background-color: ${tdColor}40;`;
                        } else {
                            ite.style.cssText = `background-color: ${tmColor}40;`;
                        }
                    } else if (qtColor == 2) {
                        if (tmp2 === "灌水区") {
                            ite.style.cssText = `background-color: ${gsColor};`;
                        } else if (tmp2 === "学术版") {
                            ite.style.cssText = `background-color: ${xsColor};`;
                        } else if (tmp2 === "站务版") {
                            ite.style.cssText = `background-color: ${zwColor};`;
                        } else if (tmp2 === "工单反馈版") {
                            ite.style.cssText = `background-color: ${fkColor};`;
                        } else if (tmp2 === "小黑屋") {
                            ite.style.cssText = `background-color: ${hwColor};`;
                        } else if (tmp2.startsWith("团队")) {
                            ite.style.cssText = `background-color: ${tdColor};`;
                        } else {
                            ite.style.cssText = `background-color: ${tmColor};`;
                        }
                    }
                }
            }
        }
        var tmpEl = document.querySelectorAll('div.avatar-right');
        for (var i = 0; i < tmpEl.length; i++) {
            let ele1 = tmpEl[i].querySelectorAll('a.row.content-left.title.link.color-default');
            for (let ite of ele1) {
                ite.style.color = txColor;
            }
            let ele2 = tmpEl[i].querySelectorAll('div.time');
            for (let ite of ele2) {
                ite.style.color = txColor;
            }
            let ele3 = tmpEl[i].querySelectorAll('span.forum-name');
            for (let ite of ele3) {
                ite.style.color = txColor;
            }
            let ele4 = tmpEl[i].querySelectorAll('g');
            for (let ite of ele4) {
                ite.style.color = txColor;
            }
        }
        //帖子列表左侧栏字体颜色
        tmpEl = document.querySelector('div.card.left.padding-default');
        if (tmpEl) {
            tmpEl = tmpEl.querySelector('div.section');
            if (tmpEl) {
                let ele1 = tmpEl.querySelectorAll('a.forum-container.section-item.row-item.color-default.link');
                for (let ite of ele1) {
                    let e2List = ite.querySelectorAll('span.forum-name');
                    for (let ele2 of e2List) {
                        if (ele2.classList.contains('active')) {
                            ele2.style.color = ''; // 清除style.color属性
                        } else {
                            ele2.style.color = txColor;
                        }
                    }
                }
            }
        }
        // 改背景
        const mainE = document.querySelector('.wrapped.lfe-body.mobile-body');
        const bodyE = document.body;
        if (mainE) {
            if (opt === 1) {
                mainE.style.background = bg;
            } else {
                bodyE.style.backgroundImage = `url("${bg}")`;
                bodyE.style.backgroundSize = 'cover';
                bodyE.style.backgroundRepeat = 'no-repeat';
                bodyE.style.backgroundAttachment = 'fixed';
                mainE.style.backgroundColor = 'transparent';
            }
        } else {
            const mainE = document.querySelector('.lfe-body.mobile-body');
            if (mainE) {
                if (opt === 1) {
                    mainE.style.background = bg;
                } else {
                    bodyE.style.backgroundImage = `url("${bg}")`;
                    bodyE.style.backgroundSize = 'cover';
                    bodyE.style.backgroundRepeat = 'no-repeat';
                    bodyE.style.backgroundAttachment = 'fixed';
                    mainE.style.backgroundColor = 'transparent';
                }
            }
        }
        const tmpF = document.getElementsByClassName('card padding-default');
        if (tmpF.length >= 2 && hrefTmp.slice(0, 36) != "https://www.luogu.com.cn/discuss/new" && hrefTmp.slice(0, 32) == "https://www.luogu.com.cn/discuss") {
            const tmpColor = hexToRgb(tmColor);
            tmpF[1].style = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
        }
        const forumElement = document.querySelector("section.side");
        if (forumElement != null) {
            // 获取所属板块的文本内容
            const forumTextElement = forumElement.querySelector("a.color-default");
            if (forumTextElement != null) {
                const forumText = forumTextElement.textContent.trim();
                if (document.querySelector("section.main") != null) {
                    const tmp = document.querySelector("section.main").querySelector("div.card.padding-default");
                    // 根据所属板块的文本内容判断是否需要修改颜色
                    if (forumText === '站务版' && !(hrefTmp.startsWith('https://www.luogu.com.cn/discuss/new'))/* 防止在帖子发布页（https://www.luogu.com.cn/discuss/new?forum=xxx）底下也出现站务版颜色边框 */) {
                        const tmpColor = hexToRgb(zwColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    } else if (forumText === '题目总版') {
                        const tmpColor = hexToRgb(tmColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    } else if (forumText === '学术版') {
                        const tmpColor = hexToRgb(xsColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    } else if (forumText === '灌水区') {
                        const tmpColor = hexToRgb(gsColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    } else if (forumText === '工单反馈版') {
                        const tmpColor = hexToRgb(fkColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    } else if (forumText === '小黑屋') {
                        const tmpColor = hexToRgb(hwColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    } else if (forumText.startsWith('团队')) {// 团队帖子内
                        const tmpColor = hexToRgb(tdColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    } else if (hrefTmp.startsWith('https://www.luogu.com.cn/discuss/'/* 确保在讨论区 */ && !(hrefTmp.startsWith('https://www.luogu.com.cn/discuss/new'))/* 防止在帖子发布页（https://www.luogu.com.cn/discuss/new?forum=xxx）底下也出现题目版颜色边框 */)) {// 在题目详情页中
                        const tmpColor = hexToRgb(tmColor); // 将十六进制颜色转换为 rgb 形式
                        // 修改元素的颜色属性
                        tmp.style.cssText = `border-bottom: 2px solid rgb(${tmpColor.r}, ${tmpColor.g}, ${tmpColor.b});`;
                    }
                }
            }
        }
        const v = document.getElementsByClassName('card padding-default');
        const a = document.querySelectorAll("[title=全部板块]");
        for (let ite of a) {
            ite.style.cssText = `--forum-color: ${qbColor}; color: var(--forum-color);`;
        }
        const b = document.querySelectorAll("[title=站务版]");
        for (let ite of b) {
            ite.style.cssText = `--forum-color: ${zwColor}; color: var(--forum-color);`;
        }
        const c = document.querySelectorAll("[title=题目总版]");
        for (let ite of c) {
            ite.style.cssText = `--forum-color: ${tmColor}; color: var(--forum-color);`;
        }
        const d = document.querySelectorAll("[title=学术版]");
        for (let ite of d) {
            ite.style.cssText = `--forum-color: ${xsColor}; color: var(--forum-color);`;
        }
        const e = document.querySelectorAll("[title=灌水区]");
        for (let ite of e) {
            ite.style.cssText = `--forum-color: ${gsColor}; color: var(--forum-color);`;
        }
        const f = document.querySelectorAll("[title=工单反馈版]");
        for (let ite of f) {
            ite.style.cssText = `--forum-color: ${fkColor}; color: var(--forum-color);`;
        }
        const g = document.querySelectorAll("[title=小黑屋]");
        for (let ite of g) {
            ite.style.cssText = `--forum-color: ${hwColor}; color: var(--forum-color);`;
            const svgElement = ite.querySelector("svg");
            const pathElement = svgElement.querySelector("path");
            pathElement.setAttribute("d", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48"); //更改小黑屋图标（从四个方块改成一个方块）
        }
        const h = document.querySelectorAll("[title^=团队]");
        for (let ite of h) {
            ite.style.cssText = `--forum-color: ${tdColor}; color: var(--forum-color);`;
            const svgElement = ite.querySelector("svg");
            const pathElement = svgElement.querySelector("path");
            pathElement.setAttribute("d", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48"); //更改小黑屋图标（从四个方块改成一个方块）
        }

        const tmp = document.querySelectorAll("div.card");
        for (let ite of tmp) {
            if (!ite.classList.contains("reply-editor") && !ite.classList.contains("modal-card") && !ite.classList.contains("reply-card") && !ite.classList.contains("float-card")) {
                ite.style.backgroundColor = kpColorT;
            } else {
                ite.style.backgroundColor = kpColorT.slice(0, -2);
            }
        }//改各种主题颜色
        if (ch == 1) {
            const c = document.getElementsByClassName("card post-item padding-default");
            for (let ite of c) {
                if (ite.querySelector("[title=站务版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(zwColor)}40; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=题目总版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(tmColor)}40; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=学术版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(xsColor)}40; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=灌水区]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(gsColor)}40; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=工单反馈版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(fkColor)}40; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=小黑屋]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(hwColor)}40; color: var(--forum-color);`;
                } else if (ite.querySelector("[title^=团队]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(tdColor)}40; color: var(--forum-color);`;
                } else {// 题目讨论区
                    ite.style.cssText = `background-color: ${lighterColor(tmColor)}40; color: var(--forum-color);`;
                }
            }// 改背景色
        } else if (ch == 2) {
            const c = document.getElementsByClassName("card post-item padding-default");
            for (let ite of c) {
                if (ite.querySelector("[title=站务版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(zwColor)}; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=题目总版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(tmColor)}; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=学术版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(xsColor)}; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=灌水区]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(gsColor)}; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=工单反馈版]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(fkColor)}; color: var(--forum-color);`;
                } else if (ite.querySelector("[title=小黑屋]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(hwColor)}; color: var(--forum-color);`;
                } else if (ite.querySelector("[title^=团队]") != null) {
                    ite.style.cssText = `background-color: ${lighterColor(tdColor)}; color: var(--forum-color);`;
                } else {// 题目讨论区
                    ite.style.cssText = `background-color: ${lighterColor(tmColor)}; color: var(--forum-color);`;
                }
            }// 改背景色
        }
        if (hrefTmp == "https://www.luogu.com.cn/") {
            const tmpBb = document.getElementsByClassName("am-comment-bd");
            for (let ite of tmpBb) {
                ite.style.cssText = `color: #404040`;
            }
            const tmparr = document.getElementsByClassName("lg-article");
            for (let ite of tmparr) {
                if (ite.innerText.slice(0, 4) == "最近讨论") {
                    //alert();
                    const tmparr2 = ite.getElementsByClassName("am-panel");
                    for (let ite2 of tmparr2) {
                        const tstr = ite2.getElementsByClassName("lg-small")[1].innerText.slice(0, 6);
                        //ite2.style = "border-color: #00000000;";// 去除边框
                        if (qtColor == 1) {
                            if (tstr == "In 站务版") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(zwColor)}40;`;
                            } else if (tstr == "In 学术版") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(xsColor)}40;`;
                            } else if (tstr == "In 灌水区") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(gsColor)}40;`;
                            } else if (tstr == "In 反馈、") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(fkColor)}40;`;
                            } else {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(tmColor)}40;`;
                            }
                        } else if (qtColor == 2) {
                            if (tstr == "In 站务版") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(zwColor)};`;
                            } else if (tstr == "In 学术版") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(xsColor)};`;
                            } else if (tstr == "In 灌水区") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(gsColor)};`;
                            } else if (tstr == "In 反馈、") {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(fkColor)};`;
                            } else {
                                ite2.style = `border-color: #00000000; background-color: ${lighterColor(tmColor)};`;
                            }
                        }
                    }
                }
            }
        }
        //私信
        if (hrefTmp.slice(0, 29) === "https://www.luogu.com.cn/chat") {
            const tmp = document.getElementsByClassName("main")[0].getElementsByClassName("message");
            for (let ite of tmp) {
                ite.style = "color: #404040";
            }
        }
        //以下代码经允许参考自 cff_0102
        function removeElementsWithExlg(element) {
            const children = element.children;
            for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                if (child.outerHTML.includes("exlg")) {
                    element.removeChild(child);
                } else {
                    removeElementsWithExlg(child);
                }
            }
        }
        if (hrefTmp === 'https://www.luogu.org/') {
            removeElementsWithExlg(document.body);
        }
        var cssArr = [".lfe-body{",
            `    color: ${txColor};`,
            "}",
            ".info-content[data-v-6f2f45fc]{",
            `    color: ${lighterColor(txColor)}!important;`,
            "}",
        ].join('\n');
        var yStyle = document.querySelectorAll("style");
        var jiaStr = "";
        let cond = 0;
        for (let i = 0; i < yStyle.length; i++) {
            var sty1 = yStyle[i];
            var styText1 = sty1.textContent || sty1.innerText;
            var lines = styText1.split('\n');
            var tmpChk = 6;
            if (lines.length >= tmpChk) {
                jiaStr = lines.slice(-tmpChk).join('\n');
                if (jiaStr === cssArr) {
                    cond = 1;
                    break;
                }
            }
        }
        if (!cond) {
            if (typeof GM_addStyle != "undefined") {
                GM_addStyle(cssArr);
            } else if (typeof PRO_addStyle != "undefined") {
                PRO_addStyle(cssArr);
            } else if (typeof addStyle != "undefined") {
                addStyle(cssArr);
            } else {
                var node1 = document.createElement("style");
                node1.type = "text/css";
                node1.appendChild(document.createTextNode(cssArr));
                var heads1 = document.getElementsByTagName("head");
                if (heads1.length > 0) {
                    heads1[0].appendChild(node1);
                } else {
                    document.documentElement.appendChild(node1);
                }
            }
        }
        //优化通知颜色
        if (window.location.href.slice(0, 42) === "https://www.luogu.com.cn/user/notification") {
            const tmp = document.getElementsByClassName("title");
            for (let ite of tmp) {
                ite.style.cssText = `color: ${txColor};`;
            }
            const tmp2 = document.getElementsByClassName("time");
            for (let ite of tmp2) {
                ite.style.cssText = `color: ${txColor};`;
            }
            const tmp3 = document.getElementsByClassName("content marked");
            for (let ite of tmp3) {
                ite.style.cssText = `color: ${txColor};`;
            }
        }
        // 优化首页卡片颜色
        var stdChk = 0;
        const tmpArticle = document.getElementsByClassName("lg-article");
        for (let ite of tmpArticle) {
            if (stdChk == 1 || stdChk >= 3) {
                ite.style.cssText = `background-color: ${kpColorT}`;
            } else if (stdChk == 2 && syLianXiGai == 1) {
                ite.style.cssText = `background-color: ${kpColorT}`;
            }
            stdChk += 1;
        }
        // 优化用户练习页面颜色
        if (hrefTmp.slice(0, 29) == "https://www.luogu.com.cn/user" /*&& hrefTmp.search("#practice") != -1*/) {
            const tmpPrac = document.getElementsByClassName("card padding-default");
            for (let ite of tmpPrac) {
                ite.style.cssText = `background-color: ${kpColorT}; color: ${txColor};`;
                const tmpCapt = ite.getElementsByClassName("lfe-caption caption");
                for (let ite of tmpCapt) {
                    ite.style.cssText = `color: ${txColor}`;
                }
            }
            /*const tmpH3 = document.getElementsByClassName("lfe-h3");
                for (let ite of tmpH3) {
                    ite.style.cssText = `color: ${txColor}`;
                }*/
            const tmp = document.getElementsByClassName("user-header-bottom");
            for (let ite of tmp) {
                ite.style.cssText = `background-color: ${kpColorT}; color: ${txColor};`;
            }
        }
        // 更改顶栏颜色
        /*const tmpDl = document.getElementsByClassName("wrapper wrapped lfe-body header-layout tiny");
        if (tmpDl.length >= 1) {
            tmpDl[0].style.background = dlColor;
            const tmpDl2 = tmpDl[0].getElementsByClassName("user-nav");
            if (tmpDl2.length >= 1) {
                tmpDl2[0].style.cssText = `color: ${dlColor2};`;
            }
        }*/
        // 更改顶栏背景颜色（参考自 cff_0102
        var targetCSS = [
            "#app > .main-container > .header-layout.tiny{",
            "    height: 4em !important;",
            `    background: ${dlColor} !important;`,
            "}",
        ].join('\n');
        var xStyle = document.querySelectorAll("style");
        var zStr = "";
        var fo = 0;
        for (let ite = 0; ite < xStyle.length; ite++) {
            var styl = xStyle[ite];
            var stylT = styl.textContent || styl.innerText;
            var lin = stylT.split('\n');
            var numChk = 4;
            if (lin.length >= numChk) {
                zStr = lines.slice(-numChk).join('\n');
                if (zStr === targetCSS) {
                    fo = 1;
                    break;
                }
            }
        }
        if (!fo) {
            if (typeof GM_addStyle != "undefined") {
                GM_addStyle(targetCSS);
            } else if (typeof PRO_addStyle != "undefined") {
                PRO_addStyle(targetCSS);
            } else if (typeof addStyle != "undefined") {
                addStyle(targetCSS);
            } else {
                var jd = document.createElement("style");
                jd.type = "text/css";
                jd.appendChild(document.createTextNode(targetCSS));
                var fHead = document.getElementsByTagName("head");
                if (fHead.length > 0) {
                    fHead[0].appendChild(jd);
                } else {
                    document.documentElement.appendChild(jd);
                }
            }
        }
        // 更改字体颜色
        const tmpp = document.querySelector('div.wrapper.wrapped.lfe-body.header-layout.tiny');
        if (tmpp) {
            var flc = tmpp.querySelector('div.link-container');
            if (flc) {
                var bgDiv = flc.querySelectorAll('a.header-link.color-none');
                bgDiv.forEach(function (div) {
                    div.style.color = dlColor2;
                });
            }
        }
        const navTmp = document.getElementsByClassName('wrapper wrapped lfe-body header-layout tiny');
        if (navTmp.length >= 1) {
            const navTmp2 = navTmp[0].getElementsByClassName('user-nav');
            if (navTmp2.length >= 1) {
                navTmp2[0].style.cssText = `color: ${dlColor2};`;
            }
        }
        // 优化陶片放逐颜色
        if (hrefTmp.slice(0, 34) === "https://www.luogu.com.cn/judgement") {
            document.getElementsByClassName("lg-summary-content")[0].style.cssText = "color: #404040";
            const tmp = document.getElementsByClassName("am-comment-bd");
            for (let ite of tmp) {
                ite.style.cssText = "color: #404040";
            }
        }
        // 改目录图标颜色（经允许参考自 cff_0102 的代码
        var tmp1 = document.querySelectorAll("button[data-v-453d795e]:not(.selected)");
        for (let ite of tmp1) {
            ite.style.backgroundColor = bg.slice(0, -2);
            ite.style.color = txColor;
            // 找到所有包含SVG图像的<img>元素
            const imgElements = ite.querySelectorAll('img[data-v-453d795e][src^="data:image/svg+xml;base64,"]');

            // 定义要替换的颜色
            var tttttemp = hexToRgb(txColor);
            const newFillColor = `fill: ${txColor};`;

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
        tmp1 = document.querySelectorAll("button[data-v-453d795e].selected");
        for (let ite of tmp1) {
            ite.style.backgroundColor = "";
            ite.style.color = "";
        }
        const tmpZk2 = document.getElementsByClassName("expand-tip lfe-caption");
        for (let ite of tmpZk2) {
            tmp1 = ite.querySelectorAll("span");
            for (let ite2 of tmp1) {
                ite2.style.color = `${txColor}`;
            }
        }
        /*
        tmp1 = document.querySelectorAll("div.inner-card");
        for (let ite of tmp1) {
            ite.style.backgroundColor = bg.slice(0, -2);
        }
        */
        /*
        tmp1 = document.querySelectorAll("code");
        for (let ite of tmp1) {
            ite.style.backgroundColor = bg.slice(0, -2);
            ite.style.color = txColor;
        }
        */
        /*
        tmp1 = document.querySelectorAll("div.marked pre");
        for (let ite of tmp1) {
            ite.style.backgroundColor = bg.slice(0, -2);
        }*/
        /*
        tmp1 = document.querySelectorAll("div.bottom.float-bottom");
        for (let ite of tmp1) {
            ite.style.backgroundColor = bg;
        }
        */
        tmp1 = document.querySelectorAll("div[data-v-b5709dda].bottom:not(.float-bottom)");
        for (let ite of tmp1) {
            ite.style.backgroundColor = "";
        }
        tmp1 = document.getElementsByClassName("author");
        for (let ite of tmp1) {
            ite.style.backgroundColor= tzdlColor;
            const tmmp2 = ite.getElementsByClassName("time");
            for (let ite2 of tmmp2) {
                ite2.style.cssText = `color: ${txColor2};`;
            }
            const tmmp = ite.getElementsByClassName("color-default");
            for (let ite2 of tmmp) {
                ite2.style.cssText = `color: ${txColor2};`;
            }
        }
        tmp1 = document.getElementsByClassName("card left notice padding-default");
        for (let ite of tmp1) {
            ite.style.borderBottomWidth = "0px";
        }
        tmp1 = document.getElementsByClassName("lfe-caption grey");
        for (let ite of tmp1) {
            ite.style.borderBottomWidth = "0px";
        };
        for (let ite of tmp1) {
            ite.style.borderBottomWidth = "0px";
        }
        const tmpGrTx2 = document.getElementsByClassName("lfe-caption grey");
        if (tmpGrTx2.length >= 1) {
            tmpGrTx2[0].style.cssText = `color: ${txColor2}`;
        }
        tmp1 = document.getElementsByClassName("card message padding-default");
        if (tmp1.length >= 1) {
            tmp1[0].style.cssText = `color: ${txColor}; background-color: ${kpColor};`;
        }
        var x = document.getElementsByClassName("forum-container section-item row-item color-default link");
        if (x.length >= 1) {
            const xx = x[x.length - 1];
            if (xx.innerText != "全部板块" &&
                xx.innerText != "站务版" &&
                xx.innerText != "题目总版" &&
                xx.innerText != "学术版" &&
                xx.innerText != "灌水区" &&
                xx.innerText != "工单反馈版" &&
                xx.innerText != "小黑屋" &&
                xx.innerText.slice(0, 2) != "团队") {
                xx.style.cssText = `--forum-color: ${tmColor}; color: var(--forum-color);`;
            }
            x = document.getElementsByClassName("forum-container router-link-exact-active router-link-active color-default link");
            for (let xx of x) {
                if (xx.innerText != "全部板块" &&
                    xx.innerText != "站务版" &&
                    xx.innerText != "题目总版" &&
                    xx.innerText != "学术版" &&
                    xx.innerText != "灌水区" &&
                    xx.innerText != "工单反馈版" &&
                    xx.innerText != "小黑屋" &&
                    xx.innerText.slice(0, 2) != "团队") {
                    xx.style.cssText = `--forum-color: ${tmColor}; color: var(--forum-color);`;
                }
            }
        }
        if (window.location.href.slice(0,41) === "https://www.luogu.com.cn/problem/solution") {
            tmp1 = document.getElementsByClassName("left");
            for (let ite of tmp1) {
                const tmpp = ite.getElementsByClassName("lfe-caption");
                tmpp[tmpp.length - 1].style.cssText = `color: ${txColor3}`;
            }
            tmp1 = document.getElementsByClassName("right");
            for (let ite of tmp1) {
                ite.getElementsByClassName("color-default")[0].style.cssText = `color: ${txColor2}`;
            }
        }
    }
    //每隔 250 毫秒执行一次颜色更改函数
    setInterval(ff, 250);
})();



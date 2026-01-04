// ==UserScript==
// @name         BGM动画职位排序
// @namespace    http://tampermonkey.net/
// @version      0.36
// @description  对BGM.tv中的动画条目的staff表按照预定顺序进行排序，未定义的职位按原顺序显示，默认隐藏某些职位，在点击"更多制作人员+"之后显示
// @author       qw2.5
// @match        *://bgm.tv/subject/*
// @match        *://bangumi.tv/subject/*
// @match        *://chii.in/subject/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514088/BGM%E5%8A%A8%E7%94%BB%E8%81%8C%E4%BD%8D%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/514088/BGM%E5%8A%A8%E7%94%BB%E8%81%8C%E4%BD%8D%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 检查当前页面是否包含“TV”, “WEB”, “剧场版”, 或 “OVA”
    function isTargetMediaType() {
        const smallTag = document.querySelector('h1.nameSingle > small.grey');
        if (smallTag) {
            const text = smallTag.innerText.trim();
            return ['TV', 'WEB', '剧场版', 'OVA'].includes(text);
        }
        return false;
    }

    if (!isTargetMediaType()) {
        console.log('此页面不是目标媒体类型（TV, WEB, 剧场版, OVA），脚本不会执行。');
        return;
    }

    // 职位的排序列表
    const jobOrder = [
        "中文名", "话数", "放送开始", "放送星期", "上映年度", "发售日", "片长",
        "原作", "原案", "人物原案",
        "总导演", "导演", "系列监督", "联合导演", "副导演",
        "系列构成", "脚本",
        "分镜", "OP・ED 分镜", "主演出", "演出", "演出助理",
        "人物设定", "总作画监督", "作画监督", "作画监督助理", "动作作画监督", "机械作画监督", "特效作画监督",
        "主动画师", "构图", "数码绘图", "原画", "第二原画", "动画检查", "补间动画",
        "设定", "背景设定", "机械设定", "道具设计", "设计", "概念",
        "色彩设计", "色彩指定",
        "美术监督", "美术设计", "概念美术", "概念艺术", "背景美术",
        "CG 导演", "3DCG 导演", "3DCG",
        "摄影监督", "摄影", "特效",
        "音响监督", "配音监督", "音响", "音效", "录音", "录音助理", "配音",
        "音乐", "主题歌演出", "主题歌作词", "主题歌作曲", "主题歌编曲", "插入歌演出", "音乐制作", "音乐制作人", "音乐助理", "音楽",
        "剪辑",
        "监修",
        "企画", "出品人", "企划制作人", "执行制片人", "总制片人", "制片人", "联合制片人", "助理制片人", "副制片人", "制作助理", "宣传", "宣发", "制片", "制作", "製作", "出品",
        "动画制片人", "制作管理", "设定制作", "制作进行", "制作进行协力",
        "制作协调", "制作协力", "原作协力", "协力", "特别鸣谢",
        "监制",
        "动画制作",
        "发行", "配給"
    ];

    // 固定在最后的职位
    const fixedAtEndJobs = [
        "别名", "官方网站", "在线播放平台", "播放电视台", "其他电视台", "播放结束", "其他", "Copyright"
    ];

    // 默认隐藏的职位
    const hiddenJobs = [
        "演出助理",
        "作画监督助理", "构图", "原画", "第二原画", "动画检查", "补间动画",
        "道具设计",
        "色彩指定",
        "美术设计", "背景美术",
        "摄影", "特效",
        "音响", "音效", "录音", "录音助理",
        "剪辑",
        "主题歌作词", "主题歌作曲", "主题歌编曲", "音乐助理",
        "助理制片人", "副制片人", "制作助理",
        "制作管理", "设定制作", "制作进行", "制作进行协力",
        "原作协力", "协力", "特别鸣谢"
    ];

    // 获取所有的li标签
    const lis = document.querySelectorAll('#infobox > li');

    // 创建一个字典来存储职位和人员
    const staffDict = {};

    // 遍历每个li元素，提取信息
    lis.forEach(li => {
        const tip = li.querySelector('span.tip');
        if (tip) {
            const role = tip.innerText.trim().slice(0, -1); // 去掉最后的冒号
            const names = Array.from(li.querySelectorAll('a.l'), a => ({
                title: a.title,
                href: a.href
            }));
            staffDict[role] = { names, html: li.innerHTML };
        }
    });

    // 清空原始的staff列表
    const ul = document.querySelector('#infobox');
    ul.innerHTML = '';

    // 按照预定顺序添加到DOM
    jobOrder.forEach(role => {
        if (staffDict[role]) {
            const li = document.createElement('li');
            li.innerHTML = staffDict[role].html;
            if (hiddenJobs.includes(role)) {
                li.classList.add('hidden');
            }
            ul.appendChild(li);
            delete staffDict[role]; // 从字典中删除已处理的职位
        }
    });

    // 将剩余的职位（不在排序列表中的）按原顺序添加到DOM
    Object.keys(staffDict).forEach(role => {
        if (!fixedAtEndJobs.includes(role)) { // 不包括固定在最后的职位
            const li = document.createElement('li');
            li.innerHTML = staffDict[role].html;
            if (hiddenJobs.includes(role)) {
                li.classList.add('hidden');
            }
            ul.appendChild(li);
            delete staffDict[role]; // 从字典中删除已处理的职位
        }
    });

    // 将固定在最后的职位添加到DOM
    fixedAtEndJobs.forEach(role => {
        if (staffDict[role]) {
            const li = document.createElement('li');
            li.innerHTML = staffDict[role].html;
            if (hiddenJobs.includes(role)) {
                li.classList.add('hidden');
            }
            ul.appendChild(li);
            delete staffDict[role]; // 从字典中删除已处理的职位
        }
    });

    // 找到并绑定点击事件到现有的“更多制作人员 +”链接
    const moreLink = document.querySelector('.infobox_expand a');

    if (moreLink) {
        moreLink.addEventListener("click", function(event) {
            event.stopImmediatePropagation(); // 阻止其他事件的触发

            const hiddenLis = document.querySelectorAll('.hidden');

            const isHidden = moreLink.innerText == "更多制作人员 +";

            hiddenLis.forEach(li => {
                li.style.display = isHidden ? 'list-item' : 'none';
            });

            moreLink.innerText = isHidden ? '更多制作人员 –' : "更多制作人员 +";
        }, { capture: true }); // 使事件处理函数在捕获阶段运行
    }

    // 添加CSS样式
    const style = document.createElement('style');
    style.innerHTML = `
        .hidden { display: none; }
    `;
    document.head.appendChild(style);
})();
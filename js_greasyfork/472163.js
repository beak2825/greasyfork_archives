// ==UserScript==
// @name         1024净化
// @namespace    https://sxxskeji.com/
// @version      0.2
// @description  1024论坛净化，屏蔽成人内容，改变主题样式
// @author       geek from 2023
// @match        *://t66y.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472163/1024%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/472163/1024%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var banner = document.getElementsByClassName('banner')[0];
    banner.style.display='none';

    document.getElementsByClassName('guide')[0].style.display='none';

    document.body.innerHTML = document.body.innerHTML.replace(/草榴社區/g, '学习强国');
    document.head.innerHTML = document.head.innerHTML.replace(/草榴社區/g, '学习强国');

    document.head.innerHTML += '<link rel="icon" href="https://www.google.com/s2/favicons?sz=64&domain=zhihu.com" type="image/x-icon">';

    function replaceColor(node, originalColor, targetColor) {
        // 递归基：如果节点为null或者不是元素节点，则直接返回
        if (!node || node.nodeType !== Node.ELEMENT_NODE) { return; }
        // 替换指定颜色为目标颜色
        const currentColor = window.getComputedStyle(node).backgroundColor;
        if (currentColor === originalColor) {
            node.style.backgroundColor = targetColor;
        }
        // 获取当前节点的所有子节点
        const children = node.childNodes;
        // 遍历当前节点的子节点
        for (const child of children) {
            // 递归遍历子节点
            replaceColor(child, originalColor, targetColor);
        }
    }
    // 调用replaceColor函数并传入整个DOM树的根节点、原始颜色和目标颜色
    replaceColor(document.body, 'rgb(177, 211, 224)', '#334154');

    function changeAllTextColor(node){
        // 递归基：如果节点为null或者不是元素节点，则直接返回
        if (!node || node.nodeType !== Node.ELEMENT_NODE) { return; }
        node.style.color='#fff';
        // 获取当前节点的所有子节点
        const children = node.childNodes;
        // 遍历当前节点的子节点
        for (const child of children) {
            // 递归遍历子节点
            changeAllTextColor(child);
        }
    }
    var h_list = document.getElementsByClassName('h');
    for (const h of h_list){
        if (h.querySelector('b')!=null && h.querySelector('b').innerText == '版塊公告'){
            h.parentNode.parentNode.parentNode.parentNode.style.display='none';
        }
        changeAllTextColor(h);
    }

    function hidePrevNode(node){
        if (!node || node.nodeType !== Node.ELEMENT_NODE) { return; }
        node.style.display='none';
        var prev_node = node.previousElementSibling;
        if (prev_node && prev_node.firstElementChild.innerHTML == '贊'){ return;}
        hidePrevNode(prev_node);
    }

    var tac_head = document.querySelector('.tr2 .tac');
    if(tac_head != null && tac_head.innerText == '普通主題'){
        hidePrevNode(tac_head.parentNode);
    }

    var exclude_title = [
        '淫妻',
        '反差婊',
        '母狗',
        '一夜精品',
        '国货MM',
        '每日有货',
        '精选照片',
        '国产小姐姐的芳菲斗艳',
        '翻墙后看什么',
        '性话题',
        '抖快直播闪现',
        'GIF',
        '女优',
        '榴影分享',
        'AV',
        '后入',
        '原创',
        '爱看twitter',
        '推上经典',
        '榴影分享',
        '花样年华的姐姐',
        '图文解说',
        '宅男姬',
        '杏林春暖',
        '爱妻分享',
        '时来孕转',
        '双飞',
        'sm',
        '字母圈',
        '绿帽奴',
        '性奴',
        '爆乳',
        '操我',
        'ntr',
        '3p',
        '多人运动',
        '动图',
        '反差',
        '淫荡',
        '吃鸡',
        '约啪',
        '奶子',
        '露出',
        '屁股',
        '私房',
        '抖奶',
        '色而不淫',
        '上推特看',
        '看美女能长寿',

    ]

    var exclude_author = [
        '熵增',
        '费曼',
        '北方彭于晏',
        '海龙云石三',
        '桜木花道',
        '赵奕欢',
        '榴九',
        '第七日魔人',
    ]

    var tr3_list = document.getElementsByClassName('tr3');
    for (const tr3 of tr3_list) {
        if(tr3.querySelector('.tal h3 a') == null)
        {
            break;
        }
        var tr_title = tr3.querySelector('.tal h3 a').innerText;
        var tr_author = tr3.querySelector('td .bl').innerText
        console.log(tr_author);
        for(const ex_title of exclude_title)
        {
            if(tr_title.includes(ex_title))
            {
                tr3.style.display='none';
                break;
            }
        }
        for(const ex_author of exclude_author)
        {
            if(ex_author == tr_author)
            {
                tr3.style.display='none';
                break;
            }
        }
    }

    var head_list = document.querySelectorAll('.tac img');
    for(const head of head_list){ head.style.display='none';}


})();
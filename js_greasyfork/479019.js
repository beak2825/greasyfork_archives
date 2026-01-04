// ==UserScript==
// @name         Bangumi 首页改造计划
// @namespace    https://github.com/LearnDifferent
// @version      0.3
// @description  修改 Bangumi 首页
// @author       Zhou
// @match        *://bgm.tv/
// @match        *://bangumi.tv/
// @grant        none
// @icon         http://bgm.tv/img/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479019/Bangumi%20%E9%A6%96%E9%A1%B5%E6%94%B9%E9%80%A0%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/479019/Bangumi%20%E9%A6%96%E9%A1%B5%E6%94%B9%E9%80%A0%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 将首页右上方的内容放置到最后
    document.getElementById('columnHomeB').id = '';

    // 触发切换首页样式到按钮
    const btnList = document.getElementById('prgManagerMode');
    const styleChangeBtn = btnList.getElementsByTagName('a')[1];
    styleChangeBtn.click();

    // 移除切换首页样式按钮
    document.getElementById('switchNormalManager').remove();

    // 将首页展示条目的部分拓宽到 100%
    const columnHomeA = document.getElementById('columnHomeA');
    columnHomeA.setAttribute('style', 'width: 100%');

    // 将每个条目的字体调大
    const allSubjects = document.getElementsByClassName('tinyMode');
    for (let sub of allSubjects) {
        sub.setAttribute('style', 'font-size: medium; width: 45%; height: 15%');
    }

    // 将所有集数的按钮放大
    const eps = document.getElementsByClassName('epGird');
    for (let ep of eps) {
        // 每个集数的按钮
        let epBtns = ep.getElementsByTagName('li');
        for (let epBtn of epBtns) {
            epBtn.setAttribute('style', 'transform: scale(1.1);');
        }
    }

    // 将所有图片放大
    const allAvatar = document.getElementsByClassName('avatarSize48');
    for (let ava of allAvatar) {
        let originStyle = ava.getAttribute('style');
        ava.setAttribute('style', 'width: 55px; height: 55px; ' + originStyle);
    }

    // 将每个条目标题后面的进度放大
    const tinyHeaders = document.getElementsByClassName('tinyHeader');
    for (let tHeader of tinyHeaders) {
        // 替换 small 标签为 medium 标签
        // 获取进度的元素（index 为 0 是进度的元素，index 为 1 是 edit 按钮的元素）
        let progressPercentText = tHeader.getElementsByClassName('progress_percent_text')[0];

        let medium = document.createElement('medium');
        medium.innerHTML = progressPercentText.innerHTML;
        medium.className = progressPercentText.className;
        medium.id = progressPercentText.id;
        progressPercentText.parentNode.replaceChild(medium, progressPercentText);
        medium.setAttribute('style', 'color: #2774FF');
    }

    // 将在看按钮的文字放大
    const watchBtns = document.getElementsByClassName('prgCheckIn textTip');
    for (let watchBtn of watchBtns) {
        let originTitle = watchBtn.getAttribute('data-original-title');
        let newTitle = originTitle.replace('<small>', '');
        newTitle = newTitle.replace('</small>', '');
        watchBtn.setAttribute('data-original-title', newTitle);
    }

    // 将条目倒叙（初始的条目顺序是将最近看完的放在前面，而每周看完动画后，我想标记的应该是最久没看的才对）
    let subjectsParent = document.querySelector("div[class='infoWrapper_tv hidden clearit']");
    reverseChildren(subjectsParent);

    /**
     * 将 parent 的子节点倒序
     * @param parent 父元素
     */
    function reverseChildren(parent) {
        for (let i = 1; i < parent.childNodes.length; i++) {
            parent.insertBefore(parent.childNodes[i], parent.firstChild);
        }
    }

})();
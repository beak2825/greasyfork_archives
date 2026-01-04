// ==UserScript==
// @name         AO3屏蔽关键词
// @version      0.0.2
// @description  添加动态屏蔽关键词功能，储存在Tampermonkey后台，支持添加与移除关键词，对标题、标签、summary进行检测
// @author       ✌
// @match        https://archiveofourown.org/*
// @match        https://zyfzd.top/*
// @match        https://bk.jdkg.fun/*
// @namespace    https://greasyfork.org/users/1384897
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513807/AO3%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/513807/AO3%E5%B1%8F%E8%94%BD%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

// ========================

let blacklist = GM_getValue('blacklist', []);

// 动态更新屏蔽词
function updateBlacklist() {
    const newWord = prompt("请输入要添加的屏蔽词：");
    if (newWord) {
        blacklist.push(newWord);
        GM_setValue('blacklist', blacklist);
        alert(`添加成功！当前屏蔽词列表：${blacklist.join(', ')}`);
        window.location.reload(); // 刷新页面以应用新的屏蔽词
    }
}

function manageBlacklist() {
    let currentBlacklist = GM_getValue('blacklist', []);
    if (currentBlacklist.length === 0) {
        alert("当前没有屏蔽词。");
        return;
    }

    let blacklistText = `当前屏蔽词：\n${currentBlacklist.join('\n')}`;
    let textarea = document.createElement('textarea');
    textarea.value = blacklistText;
    textarea.style.width = "100%";
    textarea.style.height = "100px";
    textarea.readOnly = true;

    let modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.backgroundColor = 'white';
    modal.style.border = '1px solid #ccc';
    modal.style.padding = '20px';
    modal.style.zIndex = 1000;
    modal.style.width = '300px';

    let closeButton = document.createElement('button');
    closeButton.innerHTML = '关闭';
    closeButton.style.marginTop = '10px';
    closeButton.onclick = () => {
        document.body.removeChild(modal);
    };

    let input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '请输入要移除的屏蔽词';
    input.style.width = '100%';
    input.style.marginTop = '10px';

    let removeButton = document.createElement('button');
    removeButton.innerHTML = '移除屏蔽词';
    removeButton.style.marginTop = '10px';
    removeButton.onclick = () => {
        let toRemove = input.value;
        if (!toRemove) {
            alert('请输入要移除的屏蔽词。');
            return;
        }

        if (currentBlacklist.includes(toRemove)) {
            blacklist = currentBlacklist.filter(word => word !== toRemove);
            GM_setValue('blacklist', blacklist);
            alert(`已移除屏蔽词：${toRemove}\n当前屏蔽词列表：${blacklist.join(', ')}`);
            document.body.removeChild(modal);
            window.location.reload();
        } else {
            alert("未找到该屏蔽词，请检查输入是否正确。");
        }
    };

    modal.appendChild(textarea);
    modal.appendChild(input);
    modal.appendChild(removeButton);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
}

// 检测关键词是否在文本中
function test(keywords) {
    for (let k = 0; k < blacklist.length; k++) {
        if (keywords.indexOf(blacklist[k]) !== -1) return true;
    }
    return false;
}

let processedItems = new Set();

// 处理屏蔽逻辑
function applyBlacklist() {
    let works = document.querySelectorAll('li.work');

    if (blacklist.length && works.length) {
        works.forEach(work => {
            let title = work.querySelector('h4.heading a');
            let tags = work.querySelectorAll('ul.tags li a.tag');
            let summary = work.querySelector('blockquote.summary');

            let titleText = title ? title.textContent : '';
            let tagsText = Array.from(tags).map(tag => tag.textContent).join(' ');

            // 将 <br> 替换为换行符，然后按换行符拆分 summary 文本
            let summaryText = summary ? summary.innerHTML.replace(/<br\s*\/?>/gi, '\n').split('\n') : [];

            // 检查标题、标签是否包含屏蔽词
            if (test(titleText) || test(tagsText)) {
                if (!processedItems.has(work)) {
                    processedItems.add(work);
                    console.log(`屏蔽了文章: ${titleText}`);
                    work.parentElement.removeChild(work); // 移除符合条件的文章
                }
            }

            // 检查 summary 每一行是否包含屏蔽词
            for (let line of summaryText) {
                if (test(line.trim())) {
                    if (!processedItems.has(work)) {
                        processedItems.add(work);
                        console.log(`屏蔽了文章: ${titleText}`);
                        work.parentElement.removeChild(work); // 移除符合条件的文章
                    }
                }
            }
        });
    }
}

// 创建导航栏按钮
function createNavButton() {
    let nav = document.querySelector('nav');
    if (nav) {
        let addButton = document.createElement('button');
        addButton.innerHTML = '添加屏蔽词';
        addButton.style.margin = '10px';
        addButton.style.padding = '5px';
        addButton.onclick = updateBlacklist;
        nav.appendChild(addButton);

        let manageButton = document.createElement('button');
        manageButton.innerHTML = '管理屏蔽词';
        manageButton.style.margin = '10px';
        manageButton.style.padding = '5px';
        manageButton.onclick = manageBlacklist;
        nav.appendChild(manageButton);
    }
}

// 页面加载后创建按钮并应用屏蔽
window.addEventListener('load', () => {
    createNavButton();
    applyBlacklist();
});
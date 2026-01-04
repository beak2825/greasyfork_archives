// ==UserScript==
// @name         B站批量取消追番追剧
// @namespace    https://github.com/kelselchan/bilibili-batch-cancel
// @version      2.0
// @description  打印作品名+批量取消追番，手动翻页，悬浮窗口显示作品名，可拖拽、复制、下载TXT，操作提示
// @match        https://space.bilibili.com/*/bangumi*
// @grant        none
// @author       kelsey chan
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547066/B%E7%AB%99%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E8%BF%BD%E7%95%AA%E8%BF%BD%E5%89%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/547066/B%E7%AB%99%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E8%BF%BD%E7%95%AA%E8%BF%BD%E5%89%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

    let collectedTitles = [];

    // 打印当前页作品名
    function collectCurrentPageTitles(){
        let titles = Array.from(document.querySelectorAll('.bili-bangumi-card__title'))
                          .map(el => el.innerText.trim());
        if(titles.length === 0){
            console.log("本页没有找到作品名，请确认页面已完全加载。");
            return;
        }
        collectedTitles.push(...titles);
        console.log("本页作品名:", titles);
        updateFloatingWindow();
    }

    // 左侧悬浮窗口（粉色，可拖拽、复制、下载）
    let floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '80px';
    floatingWindow.style.left = '0';
    floatingWindow.style.width = '220px';
    floatingWindow.style.maxHeight = '80vh';
    floatingWindow.style.overflowY = 'auto';
    floatingWindow.style.backgroundColor = 'rgba(255,182,193,0.95)';
    floatingWindow.style.color = 'black';
    floatingWindow.style.padding = '8px';
    floatingWindow.style.zIndex = 9999;
    floatingWindow.style.fontSize = '12px';
    floatingWindow.style.borderRadius = '0 6px 6px 0';
    floatingWindow.style.cursor = 'move';
    document.body.appendChild(floatingWindow);

    // 提示文字
    let hintText = document.createElement('div');
    hintText.innerText = '保持鼠标悬浮在三个点位置';
    hintText.style.fontSize = '11px';
    hintText.style.color = '#444';
    hintText.style.marginBottom = '4px';
    floatingWindow.appendChild(hintText);

    // 复制按钮
    let copyBtn = document.createElement('button');
    copyBtn.innerText = '复制';
    copyBtn.style.display = 'block';
    copyBtn.style.width = '100%';
    copyBtn.style.marginBottom = '4px';
    copyBtn.style.padding = '4px';
    copyBtn.style.fontSize = '12px';
    copyBtn.style.cursor = 'pointer';
    copyBtn.style.backgroundColor = '#ff69b4';
    copyBtn.style.border = 'none';
    copyBtn.style.borderRadius = '4px';
    copyBtn.style.color = 'white';
    copyBtn.onclick = () => {
        if(collectedTitles.length === 0) return;
        navigator.clipboard.writeText(collectedTitles.join('\n'))
            .then(()=>alert('已复制到剪贴板 ✅'))
            .catch(()=>alert('复制失败 ❌'));
    };
    floatingWindow.appendChild(copyBtn);

    // 下载 TXT 按钮
    let downloadBtn = document.createElement('button');
    downloadBtn.innerText = '下载 TXT';
    downloadBtn.style.display = 'block';
    downloadBtn.style.width = '100%';
    downloadBtn.style.marginBottom = '4px';
    downloadBtn.style.padding = '4px';
    downloadBtn.style.fontSize = '12px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.style.backgroundColor = '#ff69b4';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '4px';
    downloadBtn.style.color = 'white';
    downloadBtn.onclick = () => {
        if(collectedTitles.length === 0) return;
        let blob = new Blob([collectedTitles.join('\n')], {type: 'text/plain'});
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'B站作品名.txt';
        a.click();
        URL.revokeObjectURL(a.href);
    };
    floatingWindow.appendChild(downloadBtn);

    let listArea = document.createElement('div');
    listArea.style.fontSize = '11px';
    listArea.style.maxHeight = '70vh';
    listArea.style.overflowY = 'auto';
    floatingWindow.appendChild(listArea);

    // 拖拽逻辑
    let isDragging = false, offsetX=0, offsetY=0;
    floatingWindow.addEventListener('mousedown', (e)=>{
        if(e.target===copyBtn || e.target===downloadBtn) return;
        isDragging = true;
        offsetX = e.clientX - floatingWindow.offsetLeft;
        offsetY = e.clientY - floatingWindow.offsetTop;
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e)=>{
        if(isDragging){
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - floatingWindow.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - floatingWindow.offsetHeight, y));
            floatingWindow.style.left = x + 'px';
            floatingWindow.style.top = y + 'px';
        }
    });
    document.addEventListener('mouseup', ()=>{ isDragging = false; });

    function updateFloatingWindow(){
        listArea.innerHTML = '';
        collectedTitles.forEach(title=>{
            let p = document.createElement('p');
            p.innerText = title;
            p.style.margin = '2px 0';
            listArea.appendChild(p);
        });
    }

    // 单条取消（鼠标经过 + 点击取消）
    async function cancelOne(moreBtn){
        try{
            moreBtn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
            await sleep(1000);
            let cancelBtn = Array.from(document.querySelectorAll('.menu-popover__panel-item'))
                                  .find(el => el.innerText.includes('取消追'));
            if(cancelBtn) cancelBtn.click();
        }catch(e){
            console.log('取消失败:', e);
        }
    }

    // 批量取消当前页
    async function cancelPage(){
        let moreBtns = document.querySelectorAll('.sic-BDC-more_vertical_fill');
        for(let btn of moreBtns){
            await cancelOne(btn);
            await sleep(2000 + Math.random()*1000);
        }
        alert("本页批量取消完成 ✅");
    }

    // 添加操作按钮（挂在“看过”旁边）
    function addControlButtons(){
        let sawItem = Array.from(document.querySelectorAll('.radio-filter__item'))
                           .find(el => el.innerText.includes('看过'));
        if(!sawItem) return;
        if(document.getElementById('bangumi-control-btns')) return;

        let container = document.createElement('div');
        container.id = 'bangumi-control-btns';
        container.style.display='inline-flex';
        container.style.alignItems='center';
        container.style.marginLeft='8px';

        // 提示文字
        let tip = document.createElement('div');
        tip.innerText = '➡ 进入下一页再点击打印按钮';
        tip.style.fontSize = '11px';
        tip.style.color = '#ff69b4';
        tip.style.marginRight = '6px';
        container.appendChild(tip);

        // 打印按钮
        let btn1 = document.createElement('button');
        btn1.innerText = '打印本页作品名';
        btn1.style.padding='4px 8px';
        btn1.style.marginRight='4px';
        btn1.style.fontSize='12px';
        btn1.style.cursor='pointer';
        btn1.style.backgroundColor = '#ff69b4';
        btn1.style.border = 'none';
        btn1.style.borderRadius = '4px';
        btn1.style.color = 'white';
        btn1.onclick = collectCurrentPageTitles;
        container.appendChild(btn1);

        // 批量取消按钮
        let btn2 = document.createElement('button');
        btn2.innerText = '批量取消本页';
        btn2.style.padding='4px 8px';
        btn2.style.fontSize='12px';
        btn2.style.cursor='pointer';
        btn2.style.backgroundColor = '#ff69b4';
        btn2.style.border = 'none';
        btn2.style.borderRadius = '4px';
        btn2.style.color = 'white';
        btn2.onclick = cancelPage;
        container.appendChild(btn2);

        sawItem.parentNode.insertBefore(container, sawItem.nextSibling);
    }

    const observer = new MutationObserver(() => addControlButtons());
    observer.observe(document.body, { childList:true, subtree:true });

    window.addEventListener('load', () => setTimeout(addControlButtons, 2000));

})();
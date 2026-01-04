// ==UserScript== 
// @name         Photopea Assistant 
// @namespace    https://photopea.com/ 
// @version      1.5
// @description  网页操作辅助工具 
// @author       丸子
// @match        *://www.photopea.com/* 
// @grant        none 
// @run-at       document-end 
// @downloadURL https://update.greasyfork.org/scripts/533350/Photopea%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/533350/Photopea%20Assistant.meta.js
// ==/UserScript==
 
(function() {
    const CLOSE_BUTTON_ID = 'close_button_icon';
    let isProcessing = false;
 
    const enhancedClick = async () => {
        if (isProcessing) return;
        isProcessing = true;
 
        // 层级检测机制 
        const btn = await document.querySelector(`#${CLOSE_BUTTON_ID}`)  
                 || document.querySelector(`[id="${CLOSE_BUTTON_ID}"]`); 
 
        if (btn) {
            // 兼容性点击方案 
            if (typeof btn.onclick  === 'function') {
                btn.onclick(); 
            } else {
                btn.click(); 
                realClick(btn); // 调用上述真实点击方法 
            }
            
            // 清除残留元素 
            btn.closest('.ad-layer')?.remove(); 
        }
 
        isProcessing = false;
    };
 
    // 三维监听策略 
    new MutationObserver(enhancedClick)
        .observe(document.documentElement,  {
            childList: true, 
            subtree: true,
            attributes: true 
        });
 
    // 增加滚动/键盘事件触发 
    window.addEventListener('scroll',  enhancedClick, { passive: true });
    document.addEventListener('keydown',  enhancedClick);
})();
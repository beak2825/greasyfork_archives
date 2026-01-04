// ==UserScript==
// @name         Liquipedia Dota 2页面精简
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides unwanted left-column modules and moves the right column's content to the left, creating a single-column view.
// @author       Gemini
// @match        https://liquipedia.net/dota2/Main_Page
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/544587/Liquipedia%20Dota%202%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/544587/Liquipedia%20Dota%202%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区 ---
    // 将您希望从左栏【隐藏】的模块的完整标题添加到此列表中。
    const modulesToHide = [
        "About Liquipedia's Dota 2 Wiki",
        "Heroes",
        "Updates",
        "Useful Articles",
        "Transfers",
        "Liquipedia Rankings",
        "Want To Help?"
    ];

    /**
     * 主函数：执行隐藏和布局重排
     */
    function hideAndRearrangeLayout() {
        console.log("Liquipedia Layout Manager: Script starting...");

        // 步骤 1: 定位左右两栏的容器
        // Liquipedia 使用 .lp-col-lg-6 class 来定义两栏布局
        const columns = document.querySelectorAll('.mainpage-v2 .lp-row > .lp-col-lg-6');
        if (columns.length < 2) {
            console.warn("Layout Manager: Could not find two columns to rearrange. Aborting.");
            return;
        }

        const leftColumn = columns[0];
        const rightColumn = columns[1];

        // 步骤 2: 隐藏左栏中指定的模块
        let modulesWereHidden = false;
        modulesToHide.forEach(title => {
            // 在左栏中查找所有模块标题
            const headings = leftColumn.querySelectorAll('.panel-box-heading');
            headings.forEach(heading => {
                if (heading.textContent.trim() === title) {
                    const moduleBox = heading.closest('.panel-box');
                    if (moduleBox) {
                        moduleBox.style.display = 'none';
                        modulesWereHidden = true;
                        console.log(`- Hiding module: "${title}"`);
                    }
                }
            });
        });

        // 步骤 3: 如果有模块被隐藏，则执行重排
        if (modulesWereHidden) {
            console.log("-> Modules hidden, proceeding to rearrange layout...");

            // 将右栏的所有子元素（即所有模块）移动到左栏
            const rightColumnChildren = Array.from(rightColumn.children);
            rightColumnChildren.forEach(child => {
                leftColumn.appendChild(child);
            });
            console.log(`-> Moved ${rightColumnChildren.length} modules from right to left.`);

            // 步骤 4: 调整布局样式
            // 将左栏的宽度 class 从半宽 (lp-col-lg-6) 改为全宽 (lp-col-lg-12)
            leftColumn.classList.remove('lp-col-lg-6');
            leftColumn.classList.add('lp-col-lg-12');

            // 彻底移除空的右栏，防止它占用任何空间
            rightColumn.remove();

            console.log("Layout Manager: Rearrangement complete!");
        } else {
            console.log("Layout Manager: No modules to hide, no rearrangement needed.");
        }
    }

    // 为了确保页面所有元素（特别是动态加载的）都已准备好，
    // 我们使用 MutationObserver 来监视页面变化。
    // 当主内容区域出现时，我们就执行脚本。
    const observer = new MutationObserver((mutations, obs) => {
        const mainContentReady = document.querySelector('.mainpage-v2 .lp-row');
        if (mainContentReady) {
            hideAndRearrangeLayout();
            obs.disconnect(); // 任务完成，停止监视
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
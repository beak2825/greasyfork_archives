// ==UserScript==
// @name         aiacademic.tongji.edu.cn脚本
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2025-03-14
// @description  左上角tab页面关闭
// @author       You
// @match        https://aiacademic.tongji.edu.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongji.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529788/aiacademictongjieducn%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/529788/aiacademictongjieducn%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
function closePanels(panels, buttons) {
            panels.forEach((panel, i) => {
                if (panel.style.display === 'block') {
                    buttons.children[i].click()
                }
            })
        }

function waitForContainer() {
        const buttons = document.querySelectorAll('.tab-nav')[0]
        const panels = document.querySelectorAll('#interact-panel')
        console.log(buttons)
    console.log(panels)
      // 你的脚本逻辑
        document.addEventListener('click', (event) => {
            let isClickInside = false;
            let flag = false

            if (buttons.contains(event.target)) {
                isClickInside = true;
            }

            // 检查点击目标是否在任一 #interact-panel 内
            panels.forEach((panel) => {
                if (panel.contains(event.target)) {
                    isClickInside = true;
                }
                if (panel.style.display === 'block') {
                    flag = true
                }
            });
            console.log('isClickInside', isClickInside)
            console.log('flag', flag)
            // 如果点击目标在区域外，触发关闭事件
            if (!isClickInside && flag) {
                closePanels(panels, buttons)
                flag = false
            }
        })
    }

function main() {
    setTimeout(() => {
    waitForContainer()
    }, 1000)
}

main();
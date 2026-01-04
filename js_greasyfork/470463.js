// ==UserScript==
// @name         乐课网点名自动应答
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  当上课时遇到点名，自动单击正确答案
// @author       NWater
// @match        https://webapp.leke.cn/interact-classroom/
// @icon         https://static.leke.cn/images/letaoedu/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470463/%E4%B9%90%E8%AF%BE%E7%BD%91%E7%82%B9%E5%90%8D%E8%87%AA%E5%8A%A8%E5%BA%94%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/470463/%E4%B9%90%E8%AF%BE%E7%BD%91%E7%82%B9%E5%90%8D%E8%87%AA%E5%8A%A8%E5%BA%94%E7%AD%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(`点名自动应答脚本已载入`);
    setInterval(()=>{
        if(document.querySelector('.ant-modal-wrap') && (
            (!document.querySelector('.ant-modal-wrap').attributes.style) ||
            (!document.querySelector('.ant-modal-wrap').attributes.style.value.match(/display\s*:\s*none/))
        )){
            console.log(`${Date()} 检测到点名: `);
            console.log(document.querySelector('.ant-modal-wrap'));
            document.querySelectorAll('span.answer').forEach((e)=>{
                if(e.textContent == eval(document.querySelector('.question').textContent.match(/[0-9]+\s*[-+*/]\s*[0-9]+/)[0])){
                    console.log(`点名自动应答: ${document.querySelector('.question').textContent.match(/[0-9]+\s*[-+*/]\s*[0-9]+/)[0]} = ${e.textContent}`);
                    e.click();
                }
            });
        }
    },1000);
})();
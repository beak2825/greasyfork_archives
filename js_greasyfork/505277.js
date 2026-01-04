// ==UserScript==
// @name         兰州理工大学教务系统课程表修正
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2
// @description  修正教务系统课程表的显示问题（如课程名称被显示成开课班级）
// @author       PA733
// @match        *://jwxt.lut.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505277/%E5%85%B0%E5%B7%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E8%A1%A8%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/505277/%E5%85%B0%E5%B7%9E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%BE%E7%A8%8B%E8%A1%A8%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 监视 script 标签插入的变化
    const observer = new MutationObserver(function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'SCRIPT' && node.src.includes('kbck.js')) {
                        // 拦截并替换目标脚本
                        interceptAndReplaceScript(node);
                    }
                });
            }
        }
    });

    observer.observe(document.head || document.documentElement, {
        childList: true,
        subtree: true
    });

    function interceptAndReplaceScript(scriptNode) {
        fetch(scriptNode.src)
            .then(response => response.text())
            .then(code => {
                // 美化教室名: kb.classroomName
                // 去除节次
                let patchedCode = code.replace(
                    /kb\.classroomName\s*=\s*.*?;/s,
                    `kb.classroomName = kb_data[i].ZCMC + ", " + (pub_param.action == "queryjaskb" ? "" : kb_data[i].JASMC);`
                );

                // 修正课程名: kb.className
                patchedCode = patchedCode.replace(
                    /kb\.className\s*=\s*.*?;/s,
                    `kb.className = (kb_data[i].KCM == null ? "" : kb_data[i].KCM);`
                );

                // 插入修改后的脚本
                const newScript = document.createElement('script');
                newScript.textContent = patchedCode;
                document.head.appendChild(newScript);

                // 移除原始 script 标签
                scriptNode.parentNode.removeChild(scriptNode);
            });
    }
})();
// ==UserScript==
// @name         Nga 禁用可视化编辑器
// @author       monat151
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/325815-monat151
// @version      1.0.0
// @description  拒绝不可靠的功能
// @match        http*://bbs.nga.cn/post.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526743/Nga%20%E7%A6%81%E7%94%A8%E5%8F%AF%E8%A7%86%E5%8C%96%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/526743/Nga%20%E7%A6%81%E7%94%A8%E5%8F%AF%E8%A7%86%E5%8C%96%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let _PLUGIN_RUNNED = false, _INTERVAL_LOOPED = 0
    const _PLUGIN_INTERVAL = setInterval(() => {
        const self = window.postfunc
        const traditionEditorRow = document.querySelector('table.forumbox>tbody>tr.row1')
        const titleRow = document.querySelector('table.forumbox>tbody>tr.row2')
        if (self && traditionEditorRow && titleRow) {
            try {
                const nowUsingNewEditor = traditionEditorRow.style.display === 'none'
                if (nowUsingNewEditor) {
                    var x = function(o){
                        var y = o.getBoundingClientRect(); return y.height ? y.height : y.bottom-y.top
                    }, z = x(self.o_wysiwyg_editor), p = titleRow , y = 0
                    self.o_wysiwyg_editor.style.display='none'
                    for(var i=0; i<3; i++){
                        p = p.nextSibling
                        p.style.display=''
                    }
                    for(i=0; i<3; i++){
                        y += x(p)
                        p = p.previousSibling
                    }
                    self.o_content.style.height = (z-y)+'px'
                    self.o_content.style.display = ''
                }
                const damnBtn = document.querySelector('table.forumbox>tbody>tr.row2>td.c2>button')
                if (damnBtn) damnBtn.style = 'display: none;'
                console.log('[Nga 禁用可视化编辑器] 插件运行成功。')
                window.clearInterval(_PLUGIN_INTERVAL)
            } catch (e) {
                console.warn('[Nga 禁用可视化编辑器] 插件运行出错，等待重试。\n错误信息：', e)
            }
        } else {
            if (_INTERVAL_LOOPED > 30) {
                console.error('[Nga 禁用可视化编辑器] 插件运行失败次数过多，任务取消。')
                window.clearInterval(_PLUGIN_INTERVAL)
            }
            _INTERVAL_LOOPED++
        }
    }, 100)
})();
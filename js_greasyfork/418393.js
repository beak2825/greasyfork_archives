// ==UserScript==
// @name         跳过bilibili充电鸣谢
// @namespace    https://plushine.cn
// @version      3.0
// @description  自动跳过视频最后的充电鸣谢页面
// @author       XJHui
// @match        https://www.bilibili.com/video/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/418393/%E8%B7%B3%E8%BF%87bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/418393/%E8%B7%B3%E8%BF%87bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    /**
        2022-08-31 更新，感谢以下文章/教程创作者：
        1、油猴官方文档：https://www.tampermonkey.net/documentation.php?ext=dhdg#GM_setValue
        2、油猴脚本存取变量：https://zhuanlan.zhihu.com/p/485574687
        3、Emoji表情：https://www.emojidaquan.com/all-symbols-emojis
        4、js弹出窗：https://www.xp.cn/b.php/85572.html
        5、js刷新当前页面：https://product.pconline.com.cn/itbk/software/zhwtl/1610/8509429.html
    **/

    // 获取存放的标记变量的值（重启浏览器、切换页面后值不会改变）
    let flag = GM_getValue('flag')
    // 值不存在返回undefined，赋初值为true（不能在脚本中直接使用GM_setValue给标记变量赋值）
    if (flag === 'undefined') {
        flag = true
    }
    // 插件栏添加按钮
    GM_registerMenuCommand((flag ? '❎' : '✅') + '多P视频自动连播（点我' + (flag ? '开启' : '关闭') + '）', function() {
        // 弹出对话框，等待用户选择
        if (confirm('确定要【' + (flag ? '开启' : '关闭') + '】多p视频自动连播吗？')) {
            // 用户点击“确定”，修改标记变量的值
            GM_setValue('flag', !flag)
            // 设置生效后，刷新页面
            location.replace(location.href)
        }
    })
    // 定时器
    setInterval(() => {
        // 页面分p
        if (document.getElementsByClassName('list-box').length >= 1) {
            // 页面中【自动连播】按钮处于关闭状态
            if (document.getElementsByClassName('switch-button on').length === 0) {
                // 用户需要自动连播
                if (!flag) {
                    document.getElementsByClassName('switch-button')[0].click()
                }
            } else { // 页面中【自动连播】按钮处于开启状态
                if (flag) { // 用户不需要自动连播
                    document.getElementsByClassName('switch-button')[0].click()
                }
            }
        } else {
            // 页面未分p，取消自动连播
            if (document.getElementsByClassName('switch-button on').length === 1) {
                // 未分p页面并且勾选了【自动连播】按钮，取消勾选
                document.getElementsByClassName('switch-button')[0].click()
            }
        }
        // 判断是否加载充电鸣谢
        if (document.getElementsByClassName('bpx-player-electric-jump')[0]) {
            // 模拟点击
            document.getElementsByClassName('bpx-player-electric-jump')[0].click()
        }
    }, 100)
})();
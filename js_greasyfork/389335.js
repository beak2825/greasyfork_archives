// ==UserScript==
// @name         CHH读帖极简模式
// @namespace    https://reeye.cn/
// @version      0.3
// @description  去除不重要占位置的元素
// @author       Reeye
// @match        https://www.chiphell.com/thread-*.html
// @match        https://www.chiphell.com/forum.php?mod=viewthread*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389335/CHH%E8%AF%BB%E5%B8%96%E6%9E%81%E7%AE%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/389335/CHH%E8%AF%BB%E5%B8%96%E6%9E%81%E7%AE%80%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    function R(className) {
        return document.getElementsByClassName(className)
    }

    function remove(p) {
        if (p && p.length > 0) {
            for (let i = 0; i < p.length; i++) {
                p[i].style.setProperty('display', 'none', 'important')
            }
        }
    }

    // 回帖内容最小高度(论坛默认是100px)
    for (let i = 0; i < R('t_fsz').length; i++) {
        // 修改下面这个 10px 可控制回帖内容的最小高度
        R('t_fsz')[i].style.minHeight = '10px'
    }

    // 头像
    // remove(R('avatar'))

    // 主题 帖子 积分
    // remove(R('tns xg2'))

    // 用户等级文本
    for (let i = 0; i < R('tns xg2').length; i++) {
        // 在下面这行 行首 添加 "//" 即可正常显示 用户等级的文本信息
        // R('tns xg2')[i].nextSibling.nextSibling.style.setProperty('display', 'none', 'important')
    }

    // 用户等级太阳月亮
    let $span = document.getElementsByTagName('span')
    for (let i = 0; i < $span.length; i++) {
        if (/static\/image\/common\/star_level/.test($span[i].innerHTML)) {
            // 在下面这行 行首 添加 "//" 即可正常显示 用户等级的图标信息
            $span[i].style.setProperty('display', 'none', 'important')
        }
    }

    // 左侧自定义头衔
    //remove(R('xg1'))

    // 精华 门户 邪恶 注册时间 QQ交谈
    // remove(R('pil cl'))

    // 勋章
    remove(R('md_ctrl'))

    // 发消息
    remove(R('xl xl2 o cl'))

    // 个人签名
    // remove(R('plc plm'))
})();
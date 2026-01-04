// ==UserScript==
// @name         Steam显示隐藏的偏好设置
// @namespace    https://store.steampowered.com/
// @version      0.4
// @description  将Steam偏好设置里隐藏的设置完整的显示出来，包括选项的标题和描述。可解决例如Wallpaper Engine:壁纸引擎 锁国区等问题
// @author       eSakura
// @match        https://store.steampowered.com/account/preferences
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474193/Steam%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E7%9A%84%E5%81%8F%E5%A5%BD%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/474193/Steam%E6%98%BE%E7%A4%BA%E9%9A%90%E8%97%8F%E7%9A%84%E5%81%8F%E5%A5%BD%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var doms = document.querySelectorAll('.preference_row.account_setting_not_customer_facing');
    // 显示选项
    doms.forEach(function(dom) {
        dom.classList.remove('account_setting_not_customer_facing');
    });

    // 添加标签内容
    doms[0].getElementsByTagName("label")[0].innerText = '频繁的裸露画面或色情内容 '
    doms[0].getElementsByTagName("span")[0].innerHTML ='\n主要展示裸露画面或色情主题的游戏或内容。勾选此复选框即表示您确认自己已至少年满 18 周岁。<br>\n<a href="javascript:ViewTitlesWithDescriptors( 4 );">查看示例产品(国区无法查看示例)\t</a>\n'

    doms[1].getElementsByTagName("label")[0].innerText = '仅限成人的色情内容'
    doms[1].getElementsByTagName("span")[0].innerHTML = '\n包含仅针对成人受众的性意味明显或露骨的游戏或内容。勾选此复选框即表示您确认自己已至少年满 18 周岁。<br>\n<a href="javascript:ViewTitlesWithDescriptors( 3 );">查看示例产品(国区无法查看示例)\t</a>\n'

    // 增加一个小提示
    document.querySelectorAll('div.hspacer')[0].innerText = "脚本提示：更改最后两项设置后再次进入不会显示开启属正常情况";
})();
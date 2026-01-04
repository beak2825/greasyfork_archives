// ==UserScript==
// @name        知乎_话题_获取完整话题结构
// @namespace   zhihu
// @include     https://www.zhihu.com/topic/*/organize/entire
// @version     3
// @grant       none
// @description 知乎_话题_每隔1毫秒点击“加载更多”和“显示子话题”
// @downloadURL https://update.greasyfork.org/scripts/34518/%E7%9F%A5%E4%B9%8E_%E8%AF%9D%E9%A2%98_%E8%8E%B7%E5%8F%96%E5%AE%8C%E6%95%B4%E8%AF%9D%E9%A2%98%E7%BB%93%E6%9E%84.user.js
// @updateURL https://update.greasyfork.org/scripts/34518/%E7%9F%A5%E4%B9%8E_%E8%AF%9D%E9%A2%98_%E8%8E%B7%E5%8F%96%E5%AE%8C%E6%95%B4%E8%AF%9D%E9%A2%98%E7%BB%93%E6%9E%84.meta.js
// ==/UserScript==

function clickitem() {
    var items = document.getElementsByName("load");
    var i;
    var itemSel = 0;
    for (i = 0; i < items.length; i++) {
        if (itemSel === 0) {
            itemSel = items[i];
            continue;
        }
        if (itemSel.offsetLeft > items[i].offsetLeft) {
            itemSel = items[i];
            continue;
        } else if (itemSel.offsetLeft == items[i].offsetLeft){
            if (itemSel.text == "显示子话题" && items[i].text == "加载更多") {
                itemSel = items[i];
            }
        }
    }
    itemSel.click();
}
setInterval(clickitem, 1);
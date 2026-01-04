// ==UserScript==
// @name         删除知乎回答
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto delete zhihu answers
// @author       Vincent Young(https://github.com/missuo)
// @match        https://www.zhihu.com/people/*/answers?page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453279/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/453279/%E5%88%A0%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

setInterval(function(){
    // 打开菜单
    document.getElementsByClassName('Popover ContentItem-action')[1].childNodes[0].click();

    //点击删除按钮
    var menu = document.getElementsByClassName('AnswerItem-selfMenu')[0];var item = menu.childNodes;item[item.length-1].click();

    //确认删除
    setTimeout(function() {
        document.getElementsByClassName('ModalButtonGroup')[0].childNodes[0].click();
    },1000)

    location.reload();
}, 2000)
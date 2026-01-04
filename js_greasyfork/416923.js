// ==UserScript==
// @name         村花论坛的点击下载替换成度盘链接
// @namespace    https://white-plus.net/
// @version      0.5
// @description  为小栗旬老哥写的脚本
// @author       aaarrrkkk
// @include      *cunhua*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416923/%E6%9D%91%E8%8A%B1%E8%AE%BA%E5%9D%9B%E7%9A%84%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E6%9B%BF%E6%8D%A2%E6%88%90%E5%BA%A6%E7%9B%98%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/416923/%E6%9D%91%E8%8A%B1%E8%AE%BA%E5%9D%9B%E7%9A%84%E7%82%B9%E5%87%BB%E4%B8%8B%E8%BD%BD%E6%9B%BF%E6%8D%A2%E6%88%90%E5%BA%A6%E7%9B%98%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.$$ = $;
    window.$ = function $(id) {
        return !id ? null : document.getElementById(id);
    }
const new_element = document.createElement("style");
new_element.innerHTML =(`.downt {
    position: relative;
}
.downt .cpbtn {
    position: absolute;
    bottom: 0;
    right: -75px;
    cursor: pointer;
    width: 75px;
}
.downt .cpbtn.success {
    border-radius: 5px;
    border: 1px dashed;
    background: #0C0;
    color: #fff;
}
`);
document.body.appendChild(new_element);
const mutationCallback = () => {
    setValue()
};
const observe = new MutationObserver(mutationCallback);
const currentDom = document.querySelector('.downinput');
const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
};
function setValue() {
    document.querySelectorAll('.downt div a').forEach((item, index) => {
    const href = item.attributes.href;
    const isCheck = item.attributes.onclick;
    if(href && href.value && !isCheck) {
        item.innerText = item.attributes.href.value
        const currentId = `current${index}`;
        $$(item).closest('.button_w').attr('id', currentId);
        $$(item).closest('.downt').append(`<button class="cpbtn" data-clipboard-target=#${currentId}>复制</button>`);
        observe.disconnect();
        const clipboard =new ClipboardJS('.cpbtn');
        clipboard.on('success', function(e) {
        e.clearSelection();
        $$(e.trigger).addClass('success').text('复制成功!')
    });
        } else if(currentDom) {
            observe.disconnect();
            observe.observe(currentDom, config);
        }
    })
}
setValue()
})();
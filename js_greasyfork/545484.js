// ==UserScript==
// @name         华为Cloud-V0.999
// @icon         http://yy.boloni.cn/cm/images/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      0.999
// @description  按钮
// @author       HEBI VISION
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545484/%E5%8D%8E%E4%B8%BACloud-V0999.user.js
// @updateURL https://update.greasyfork.org/scripts/545484/%E5%8D%8E%E4%B8%BACloud-V0999.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要查找并删除的元素的选择器
    const selectors = ['div > div > div > div > div > img,div.device_operation > div.device_BellNavi,div.device_operation > div.device_Control,div.device_operation > div.device_Modify,div.map-position > div > div > div.gd-map-kit.transitionAnim > img,#app > div.find_phone.isWapFindPhone > div.map-content > div.map-position > div > div > div:nth-child(1) > div > ul,div > div.map-scale.show,#app > div.find_phone.isWapFindPhone > div.wap-panel > div.findPhoneWap-bottomtab > div > div:nth-child(2),#app > div.find_phone.isWapFindPhone > div.wap-panel > div.findPhoneWap-bottomtab > div > div:nth-child(3),#app > div.find_phone.isWapFindPhone > div.wap-panel > div.findPhoneWap-bottomtab'];

     // 每0.5秒执行一次查找和删除操作
    setInterval(function() {
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });
    }, 500);

(function() {
    'use strict';

    function setElementHeight() {
        // 修改下面有人的窗口高度
        const elements = document.querySelectorAll('.slip-modal[data-v-4b3c5735]');
        // 遍历每个元素
        for (let i = 0; i < elements.length; i++) {
            // 将元素的 height 属性设置为 500px
            elements[i].style.height = '400px';
        }
    }

    // 首次执行
    setElementHeight();

    // 每 1 秒检查一次元素的高度
    setInterval(() => {
        setElementHeight();
    }, 1000);
})();











window.setInterval(function () {

document.querySelector('div > div > div > div > div > span > img').src = 'https://contentcenter-drcn.dbankcdn.cn/pub_1/Club_ClubFileContent_100_9/6f/v3/uhIRKTnqSz6BmOuJq5gQBQ/aGuAocRlSZG_39UxucyA7w/thumbnail.gif';
},500);
window.setInterval(function () {
document.querySelector('div.findPhone-device-img > span.deviceImg > img').src = 'https://contentcenter-drcn.dbankcdn.cn/pub_1/Club_ClubFileContent_100_9/6f/v3/uhIRKTnqSz6BmOuJq5gQBQ/aGuAocRlSZG_39UxucyA7w/thumbnail.gif';
},500);
//https://consumer.huawei.com/content/dam/huawei-cbg-site/cn/mkt/pdp/wearables/kids-watch-5x/images/s2/huawei-kids-watch-5x-all-round-guard-function-girl.gif




window.setInterval(function () {
    // 在这里指定要删除背景颜色的元素的选择器
    var selector = 'div.findPhone-device-img';
    // 获取所有匹配选择器的元素
    var elements = document.querySelectorAll(selector);
    // 遍历每个匹配的元素并删除背景颜色
    elements.forEach(function(element) {
        element.style.backgroundColor = 'transparent';
    });
},500);




window.setInterval(function () {
(function() {
    'use strict';
    // 使用document.querySelectorAll来选择符合结构的img元素
    const targetImgs = document.querySelectorAll('div > div > div > div > div > span > img');
    targetImgs.forEach(function(img) {
        img.style.width = '1.05em';
        img.style.height = '1.5em';
        img.style.transform = 'translateY(-50%)';
    });
})();
},500);


 window.setInterval(function () {
(function() {
    'use strict';
    // 使用document.querySelector获取符合选择器的元素
    const targetElement = document.querySelector('#app > div.find_phone.isWapFindPhone > div.wap-panel > div:nth-child(1) > div > div > div.slip-modal-title > div.titileText,div.findPhone-device-content > div > div.findPhone-first-line > div.findPhone-device-name');
    if (targetElement) {
        // 修改文字颜色为白色
        targetElement.style.color = '#ffffff';
    }
})();
  },500);
     window.setInterval(function () {
(function() {
    'use strict';
    // 使用document.querySelector获取符合选择器的元素
    const targetElement = document.querySelector('div.findPhone-device-content > div > div.findPhone-first-line > div.findPhone-device-name');
    if (targetElement) {
        // 修改文字颜色为白色
        targetElement.style.color = '#ffffff';
    }
})();
  },500);

 window.setInterval(function () {
(function() {
    'use strict';
    // 使用document.querySelector获取符合选择器的元素
    const targetElement = document.querySelector('#app > div.find_phone.isWapFindPhone > div.master_detail > div.operation.forHeightAquire.eject > div.header > div.header_content > div.header_name_item');
    if (targetElement) {
        // 修改文字颜色为白色
        targetElement.style.color = '#f1f3f5';
    }
})();
  },500);



 window.setInterval(function () {
(function() {
    'use strict';
    // 使用document.querySelectorAll获取符合选择器的元素列表
    const targetElements = document.querySelectorAll('#app > div.find_phone.isWapFindPhone > div.wap-panel > div:nth-child(1) > div > div > div.slip-content > div > main > div > ul > div > div.findPhone-device-content > div > div.findPhone-device-address > span.address > span:nth-child(1) > span.address-update-time');
    targetElements.forEach(function(element) {
        element.style.top = '15px';
        element.style.left = '70px';
        element.style.position = 'absolute';
    });
})();
  },500);










//持续判断元素.svg-icon[data-v-48571be8]的height是不是2em

    // 持续判断元素.svg-icon[data-v-710c972e]的height是不是3em，并设置为3em
    function checkAndSetIconSize() {
        // 查找所有具有指定类的SVG图标元素.svg-icon[data-v-48571be8]
        const svgIcons = document.querySelectorAll('#app > div.find_phone.isWapFindPhone > div.wap-panel > div:nth-child(1) > div > div > div.slip-content > div > main > div > ul > div > div.findPhone-device-img > span.deviceImg > img');

        svgIcons.forEach(icon => {
            // 获取当前高度和宽度
            const currentHeight = window.getComputedStyle(icon).height;
            const currentWidth = window.getComputedStyle(icon).width;

            // 设置目标高度和宽度
            const targetHeight = '2.5em';
            const targetWidth = '1.9169em';

            // 如果当前高度不等于目标高度，则设置高度为目标高度
            if (currentHeight !== targetHeight) {
                icon.style.height = targetHeight;
            }

            // 如果当前宽度不等于目标宽度，则设置宽度为目标宽度
            if (currentWidth !== targetWidth) {
                icon.style.width = targetWidth;
            }
        });
    }

    // 初始时执行一次
    checkAndSetIconSize();

    // 监听DOM变化，以便动态添加的元素也能被处理
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                checkAndSetIconSize();
            }
        });
    });

    // 选择需要观察的节点，这里选择整个文档体，可以根据需要调整
    const targetNode = document.body;

    // 配置观察选项
    const config = { attributes: false, childList: true, subtree: true };

    // 开始观察目标节点
    observer.observe(targetNode, config);

//持续判断元素.svg-icon[data-v-48571be8]的height是不是2em结束




})();

// ==UserScript==
// @name         创建新窗口 with 链接
// @namespace    http://your-namespace.com
// @version      1.1.0
// @description  在当前页面点击悬浮图标后，在新窗口中打开当前页面的链接
// @author       吃不吃香菜
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/477647/%E5%88%9B%E5%BB%BA%E6%96%B0%E7%AA%97%E5%8F%A3%20with%20%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/477647/%E5%88%9B%E5%BB%BA%E6%96%B0%E7%AA%97%E5%8F%A3%20with%20%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var iconUrl = GM_getValue('iconUrl', 'https://vip.helloimg.com/images/2023/10/18/o2TCvg.jpg'); // 获取保存的图标地址，默认为默认图标地址

    // 创建悬浮图标
    var floatingIcon = document.createElement('div');
    floatingIcon.style.backgroundImage = 'url(' + iconUrl + ')';
    floatingIcon.style.backgroundSize = '100% 100%';
    floatingIcon.style.position = 'fixed';
    floatingIcon.style.bottom = '20px';
    floatingIcon.style.right = '20px';
    floatingIcon.style.width = '50px';
    floatingIcon.style.height = '50px';
    floatingIcon.style.borderRadius = '50%';
    floatingIcon.style.cursor = 'pointer';
    document.body.appendChild(floatingIcon);

    // 取消窗口和文档失去焦点事件的处理函数，并在控制台中输出“运行成功”
    window.onblur = null;
    document.onblur = null;
    console.log("运行成功");

    // 点击悬浮图标时创建新窗口
    floatingIcon.addEventListener('click', function() {
        var newWindow = window.open(window.location.href, '_blank', 'width=300,height=300');
        newWindow.focus();
    });

    // 右击悬浮图标时上传新图标
    floatingIcon.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        fileInput.addEventListener('change', function() {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                iconUrl = e.target.result;
                floatingIcon.style.backgroundImage = 'url(' + iconUrl + ')';
                GM_setValue('iconUrl', iconUrl); // 保存图标地址
            };
            reader.readAsDataURL(file);
            document.body.removeChild(fileInput);
        });

        fileInput.click();
    });

})();

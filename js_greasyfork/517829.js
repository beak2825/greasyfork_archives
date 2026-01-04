// ==UserScript==
// @name         知轩藏书下载脚本
// @namespace    http://tampermonkey.net/
// @version      2024-11-18
// @description  屏蔽弹出窗口，直接下载
// @author       denghuishenmi
// @match        https://zxcs.info/download3.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxcs.info
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517829/%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/517829/%E7%9F%A5%E8%BD%A9%E8%97%8F%E4%B9%A6%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {

	// 移除点击下载按钮后弹出的空白页
	const links = document.querySelectorAll('.localdown');
    links.forEach(link => {
        link.removeAttribute('target');
    });
    console.log('已移除 target 属性');

    // 重写 down 函数
    window.down = function(url) {

        // 你可以在这里添加任何你想要的自定义操作，比如修改 URL
        // 例如，可以修改下载链接：
        if (url === "https://down.zxcs.info") {
            url = "https://39.109.126.44"; // 修改下载 URL
        }

        var search = window.location.search; // 获取书的id
        var number = search.split('=')[1];   // 取等号后的部分
        // 发起 AJAX 请求
        $.ajax({
            url: '/download1.php',
            type: 'POST',
            data: { id: number },
            success: function(result) {
                if (result !== "") {
                    window.location.assign(url + result); // 跳转到新的 URL
                }
            }
        });
    };
})();
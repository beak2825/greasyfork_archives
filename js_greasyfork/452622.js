// ==UserScript==
// @name         thomasliew的测试脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  先编写一个进行测试用
// @author       ThomasLiew
// @license      MIT
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant    GM_registerMenuCommand
// @grant    GM_unregisterMenuCommand
// @require http://code.jquery.com/jquery-1.11.0.min.js
// @require https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/html2canvas/1.4.1/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/452622/thomasliew%E7%9A%84%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452622/thomasliew%E7%9A%84%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// @require file:///Users/thomasliew/Desktop/test/tamp/test.js

const draw = () => {
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');
    html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scale: 1,
        width: window.innerWidth,
        height: window.innerHeight,
    }).then(canvas => {
        let base64 = canvas.toDataURL('image/png');
        let img = document.createElement('img');
        img.src = base64;
        img.style.position = 'fixed';
        img.style.objectFit = 'contain';
        img.style.top = 0;
        img.style.left = 0;
        img.style.zIndex = 999999;
        img.style.backgroundColor = 'rgba(0,0,0,0.5)';
        img.style.cursor = 'pointer';
        img.onclick = () => {
            img.remove();
        };
        document.body.appendChild(img);
        style.remove();    
    });
}


(function() {
    console.log('测试脚本加载成功')

    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        // 检查是否按下了 Ctrl 和 Shift 键，并且按下的键是字母 *
        if (event.shiftKey && event.key === 'Z') {
            // 在这里执行你的逻辑
            console.log('执行了快捷键操作');
            draw()
        }
    });

    // 注册右键菜单
    let id = GM_registerMenuCommand ("截屏", function(){
        // GM_unregisterMenuCommand(id);//删除菜单
    });


})();
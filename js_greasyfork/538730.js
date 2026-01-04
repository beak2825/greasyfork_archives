// ==UserScript==
// @name         页面平滑滚动
// @namespace    http://svnzk.github.io/
// @version      1.0
// @description  让页面滚动更平滑
// @author       svnzk
// @match        *://*/*
// @run-at       document-start
// @resource smscl     https://cdn.bootcss.com/smoothscroll/1.4.9/SmoothScroll.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/538730/%E9%A1%B5%E9%9D%A2%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538730/%E9%A1%B5%E9%9D%A2%E5%B9%B3%E6%BB%91%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

var smoothscroll, cssdom;
var ip_switch, btn_cancel, btn_submit, ddiv;

// 显示设置窗口
function ShowSettingWin() {
    var wdcsstext = ".mdwindow{position:fixed;z-index:9999;right:50px;top:0;transform:translateY(-100px);transition:transform .2s;width:280px;height:80px;display:block;border-bottom-left-radius:3px;border-bottom-right-radius:3px;background-color:#FFF}.mdwindow_show{transform:translateY(0);transition:box-shadow .3s;box-shadow:0 0 15px #333}.mdwindow_show:hover{box-shadow:0 0 40px #333}.mdwindow>div{margin:3px}.mdwindow input,.mdwindow span{display:inline-block}.mdwindow input[type=checkbox]{-webkit-appearance:none;appearance:none;position:relative;width:30px;height:10px;left:10px;top:3px;background-color:#6666;border:solid 1px #66666666;border-radius:10px;transition:all .3s;outline:0;user-select:none;cursor:pointer}.mdwindow input[type=checkbox]::before{content:'';position:absolute;width:15px;height:15px;border-radius:50%;background-color:#FFF;box-shadow:0 0 3px #666;top:-4px;left:-1px;transition:all .3s}.mdwindow input[type=checkbox]:checked{background-color:greenyellow;transition:all .3s}.mdwindow input[type=checkbox]:checked::before{left:15px}div.cancel_btn{display:inline-block;position:absolute;left:10px;bottom:4px;background-color:#e53935}div.submit_btn{display:inline-block;position:absolute;right:10px;bottom:4px;background-color:#81c784}.fab_btn *{user-select:none;outline:0;cursor:default}.fab_btn{transition:all .15s;border:0;border-radius:50%;width:1cm;height:1cm;line-height:1cm;box-shadow:0 0 8px #666;text-align:center;user-select:none;outline:0}.fab_btn:hover{box-shadow:0 0 16px #666;transform:scale(1.05)}.fab_btn:active{box-shadow:0 0 3px #666;transform:scale(0.95)}";
    cssdom = GM_addStyle(wdcsstext);

    ddiv = document.createElement('div');
    ddiv.classList.add("mdwindow");
    ddiv.innerHTML = '<div><label for="mdswitch">平滑滚动</label><input type="checkbox" id="mdswitch"> <span style="margin-left:20px">刷新网页生效</span></div><div><div class="cancel_btn fab_btn"><span><svg t="1574689706854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1053" width="1cm" height="1cm"><path d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z" fill="#231815" p-id="1054"></path><path d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM726.72 297.28a32 32 0 0 0-45.12 0l-169.6 169.6-169.28-169.6A32 32 0 0 0 297.6 342.4l169.28 169.6-169.6 169.28a32 32 0 1 0 45.12 45.12l169.6-169.28 169.28 169.28a32 32 0 0 0 45.12-45.12L557.12 512l169.28-169.28a32 32 0 0 0 0.32-45.44z" fill="#231815" p-id="1055"></path></svg></span></div><div class="submit_btn fab_btn"><span><svg t="1574689650777" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4887" width="1cm" height="1cm"><path d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z" fill="#231815" p-id="4888"></path><path d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM230.08 467.84a36.48 36.48 0 0 0 0 51.84L413.12 704a36.48 36.48 0 0 0 51.84 0l328.96-330.56A36.48 36.48 0 0 0 742.08 320l-303.36 303.36-156.8-155.52a36.8 36.8 0 0 0-51.84 0z" fill="#231815" p-id="4889"></path></svg></span></div></div>';

    ip_switch = ddiv.querySelector('input[type=checkbox]');
    btn_cancel = ddiv.querySelector('.cancel_btn');
    btn_submit = ddiv.querySelector('.submit_btn');

    // 初始化开关状态
    ip_switch.checked = smoothscroll;

    // 事件绑定
    btn_cancel.onclick = CloseSettingWin;
    btn_submit.onclick = () => {
        GM_setValue('smoothscroll', ip_switch.checked);
        CloseSettingWin();
        // 重新加载脚本以应用设置
        if (ip_switch.checked) {
            loadSmoothScroll();
        } else {
            // 如果禁用，移除已加载的脚本
            const existingScript = document.querySelector('script[text*="SmoothScroll"]');
            if (existingScript) {
                existingScript.remove();
            }
        }
    }

    // 显示设置窗口
    ddiv.classList.add("mdwindow_show");
    document.body.appendChild(ddiv);
}

// 关闭设置窗口
function CloseSettingWin() {
    ddiv.classList.remove('mdwindow_show');
    setTimeout(() => {
        document.body.removeChild(ddiv);
        document.head.removeChild(cssdom);
    }, 1000);
}

// 加载平滑滚动脚本
function loadSmoothScroll() {
    const existingScript = document.querySelector('script[text*="SmoothScroll"]');
    if (existingScript) return; // 已加载则不再重复加载

    var scr = document.createElement('script');
    scr.type = 'text/javascript';
    scr.textContent = GM_getResourceText('smscl');
    document.head.appendChild(scr);
}

(function() {
    'use strict';
    // 初始化平滑滚动状态
    smoothscroll = GM_getValue('smoothscroll', true);

    // 注册菜单命令
    GM_registerMenuCommand("平滑滚动 设置", ShowSettingWin);

    // 页面加载时检查并加载平滑滚动脚本
    window.addEventListener('load', () => {
        if (smoothscroll) {
            loadSmoothScroll();
        }
    });
})();
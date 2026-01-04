// ==UserScript==
// @name         checkdamuku
// @namespace    https://gist.github.com/XiaoMiku01/dfc75e1087e377a7e265a74db3ca0fb8
// @version      0.2
// @description  B站检测直播弹幕是否发送成功,将所有弹幕改为流动
// @author       XiaoMiku01
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=984333
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444094/checkdamuku.user.js
// @updateURL https://update.greasyfork.org/scripts/444094/checkdamuku.meta.js
// ==/UserScript==

(function() {
    const newWindow = {
        init: () => {
            return newWindow.Toast.init();
        },
        Toast: {
            // 设置右上角浮动提示框 Need Init
            init: () => {
                try {
                    const list = [];
                    window.toast = (msg, type = 'info', timeout = 5e3) => {
                        switch (type) {
                            case 'success':
                            case 'info':
                            case 'caution':
                            case 'error':
                                break;
                            default:
                                type = 'info';
                        }
                        const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001"><span class="toast-text">${msg}</span></div>`)[0];
                        document.body.appendChild(a);
                        a.style.top = (window.innerHeight/2 + list.length * 40 + 10) + 'px';
                        a.style.left = (document.body.offsetWidth + document.body.scrollLeft - a.offsetWidth - 5) + 'px';
                        list.push(a);
                        setTimeout(() => {
                            a.className += ' out';
                            setTimeout(() => {
                                list.shift();
                                list.forEach((v) => {
                                    v.style.top = (parseInt(v.style.top, 10) - 40) + 'px';
                                });
                                $(a).remove();
                            }, 200);
                        }, timeout);
                    };
                    return $.Deferred().resolve();
                } catch (err) {
                    console.log(err)
                    return $.Deferred().reject();
                }
            }
        }
    }
    const uid_re = document.cookie.match(/DedeUserID=([0-9]+)/);
    if (uid_re==null)return;
    const uid = uid_re[1];
    $(function () {
        newWindow.init();
        bliveproxy.addCommandHandler('DANMU_MSG', command => {
            let info = command.info;
            if(info[2][0]==uid) {console.log(info);window.toast(`弹幕：${info[1]}，发送成功！`,'success')}
            info[0][1] = 1
        })})
})();
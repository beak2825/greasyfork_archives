// ==UserScript==
// @name         一键拷贝Cookie
// @description  Ck工具
// @version      1.2
// @license      MIT
// @author       Lx
// @require      https://update.greasyfork.org/scripts/446666/1389793/jQuery%20Core%20minified.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @grant        GM_addStyle
// @grant        GM_cookie
// @grant        GM_setClipboard
// @match        **://**/**
// @namespace https://greasyfork.org/users/956311
// @downloadURL https://update.greasyfork.org/scripts/520487/%E4%B8%80%E9%94%AE%E6%8B%B7%E8%B4%9DCookie.user.js
// @updateURL https://update.greasyfork.org/scripts/520487/%E4%B8%80%E9%94%AE%E6%8B%B7%E8%B4%9DCookie.meta.js
// ==/UserScript==
(async () => {
    AddBtnElements();

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    /**
     * 添加按钮组
     * @constructor
     */
    function AddBtnElements() {
        const btns = `<div id="btns-cpck" style="position: fixed; bottom: 50px; right: 50px; z-index: 9999;">
                <button id="CP_CK" class="u-button nd-file-list-toolbar-action-item u-button--primary" style="border-radius: 5px;
    background-color: #008DDB;
    color: white;
    padding: 10px;
    font-size: 20px;
    border: none;
    font-weight: 700;">复制Cookie</button>
        </div>`;

        $('body').append(btns);

        $('#CP_CK').click(async function () {
            GM_cookie('list',{}, async (response) => {
                const cookieStr = response.map(item => `${item.name}=${item.value}`).join(';');
                if (cookieStr) {
                    GM_setClipboard(cookieStr, "text", () => Toast.fire({
                        title: '系统提示',
                        html: 'Cookie成功复制到剪贴板!',
                    }))
                    return
                } else {
                    Swal.fire({
                        title: '系统提示',
                        html: '未获取到Cookie信息！',
                    })
                }
            })
        });
    }
})();
